// server/server.js

const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// CORS設定
app.use(cors());

// APIルート設定
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
