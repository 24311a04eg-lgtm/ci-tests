require('dotenv').config();
const path = require('path');
const express = require('express');
const { pool, initDb } = require('./db');
const { isValidMessage } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Locally the frontend lives at ../frontend (sibling of backend/).
// In the Docker image it is copied to /frontend (sibling of /app).
const fs = require('fs');
const localFrontend = path.join(__dirname, '..', 'frontend');
const containerFrontend = '/frontend';
const frontendPath = fs.existsSync(localFrontend) ? localFrontend : containerFrontend;

app.use(express.json());
app.use(express.static(frontendPath));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, message, created_at FROM messages ORDER BY created_at ASC'
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/messages', async (req, res) => {
  const { message } = req.body;

  if (!isValidMessage(message)) {
    return res.status(400).json({ error: 'Message must not be empty' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO messages (message) VALUES ($1) RETURNING id, message, created_at',
      [message.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Only start the server (and connect to the DB) when this file is run
// directly, so it can be imported by tests without opening a real port.
if (require.main === module) {
  initDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to initialize database', err);
      process.exit(1);
    });
}

module.exports = app;
