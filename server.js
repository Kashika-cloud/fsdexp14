const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Welcome to the Full Stack App v1'));

// Lightweight liveness check - no database calls
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
