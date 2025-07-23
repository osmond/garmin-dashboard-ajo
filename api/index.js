
const express = require('express');
const { fetchGarminSummary } = require('./scraper');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

app.get('/api/summary', async (req, res) => {
  try {
    const summary = await fetchGarminSummary();
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Garmin data' });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}

module.exports = app;
