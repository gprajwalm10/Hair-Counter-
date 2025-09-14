// Simple Express server for admin/analyzer data sharing
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;
const DATA_FILE = __dirname + '/data.json';

app.use(cors());
app.use(express.json());

// Read data
app.get('/api/data', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read data' });
    res.json(JSON.parse(data));
  });
});

// Update data
app.post('/api/data', (req, res) => {
  fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Failed to write data' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
