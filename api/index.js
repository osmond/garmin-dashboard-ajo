const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { fetchGarminSummary } = require('./influx');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/summary', async (req, res) => {
  try {
    const data = await fetchGarminSummary();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data from InfluxDB' });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
