
const path = require('path');
// Load environment variables from the repo root .env file so running the API
// from the api/ directory works as documented.
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');

const { fetchGarminSummary, fetchWeeklySummary, fetchHistory } = require('./scraper');

const {
  fetchGarminSummary,
  fetchWeeklySummary,
  fetchActivityRoute,
} = require('./scraper');

const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 3002;

app.get('/api/summary', async (req, res) => {
  try {
    const summary = await fetchGarminSummary();
    res.json(summary);
  } catch (err) {
    console.error(err);
    if (
      err.message &&
      (err.message.includes('GARMIN_COOKIE_PATH') ||
        err.message.includes('Cookie file not found'))
    ) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch Garmin data' });
    }
  }
});

app.get('/api/weekly', async (req, res) => {
  try {
    const data = await fetchWeeklySummary();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to query InfluxDB' });
  }
});


app.get('/api/history', async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  try {
    const data = await fetchHistory(days);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to query InfluxDB' });

app.get('/api/activity/:id', async (req, res) => {
  try {
    const points = await fetchActivityRoute(req.params.id);
    res.json(points);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activity' });

  }
});

// Catch-all handler for unknown routes
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
  cron.schedule('0 0 * * *', () => {
    fetchGarminSummary().catch(err => console.error(err));
  });
}

module.exports = app;
