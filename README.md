# Message App

A minimal Node.js + Express + PostgreSQL message board, built to practice a
CI/CD pipeline (lint, unit tests, integration tests, Docker build, image
scanning, and future ECR/ECS deployment).

The app itself is intentionally tiny: one input field, one Send button, and
a list of stored messages.

## Stack

- **Frontend:** HTML, CSS, vanilla JavaScript (served statically by Express)
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Tests:** Jest, Supertest
- **Lint:** ESLint (flat config)
- **Containers:** Docker, Docker Compose

## Project layout

```text
message-app/
├── frontend/          # static HTML/CSS/JS
├── backend/           # Express API, tests, Dockerfile
├── docker-compose.yml # backend + PostgreSQL
└── .github/workflows/ # CI/CD workflows (added separately)
```

## API

| Method | Path        | Description                     |
|--------|-------------|----------------------------------|
| GET    | `/health`   | Returns `{ "status": "ok" }`     |
| GET    | `/messages` | Returns all stored messages      |
| POST   | `/messages` | Stores a new message             |

## Running locally with Docker Compose

```bash
docker compose up --build
```

The app will be available at http://localhost:3000.

## Running the backend directly

```bash
cd backend
cp .env.example .env   # then point DB_HOST at a running PostgreSQL instance
npm install
npm run dev
```

## Scripts (run from `backend/`)

| Script                  | Purpose                                              |
|--------------------------|-------------------------------------------------------|
| `npm start`              | Start the server                                     |
| `npm run dev`             | Start the server with file watching                  |
| `npm run lint`            | Run ESLint                                           |
| `npm test`                | Run unit tests                                       |
| `npm run test:integration`| Run integration tests (requires a real PostgreSQL DB)|
| `npm run test:report`     | Run all tests with coverage and a JUnit XML report    |
| `npm run build`           | Build the Docker image                               |

`npm run test:report` writes a JUnit report to `backend/reports/` and a
coverage report to `backend/coverage/`. Neither folder is checked into the
repo — both are generated when the tests run.

## Environment variables

See `backend/.env.example`:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

No credentials are hardcoded anywhere in the app.

## Database

A single `messages` table:

| Column       | Type        |
|--------------|-------------|
| `id`         | serial PK   |
| `message`    | text        |
| `created_at` | timestamptz |

The table is created automatically on startup if it doesn't exist.

## CI/CD

`.github/workflows/` is left empty on purpose — the GitHub Actions pipeline
(checkout → setup Node → cache deps → `npm ci` → `npm audit` → secret
scanning → lint → unit tests → integration tests → test reports →
artifact upload → Docker build → image tagging → health check → Trivy scan
→ notifications) is built separately.
