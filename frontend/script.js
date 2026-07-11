const form = document.getElementById('message-form');
const input = document.getElementById('message-input');
const list = document.getElementById('messages');

async function loadMessages() {
  const res = await fetch('/messages');
  const messages = await res.json();

  list.innerHTML = '';
  messages.forEach((msg) => {
    const item = document.createElement('li');

    const text = document.createElement('span');
    text.textContent = msg.message;

    const time = document.createElement('time');
    time.textContent = new Date(msg.created_at).toLocaleString();

    item.appendChild(text);
    item.appendChild(time);
    list.appendChild(item);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  await fetch('/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  input.value = '';
  await loadMessages();
});

loadMessages();
