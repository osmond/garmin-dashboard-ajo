import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
import config from './config';
import express from 'express';
import cron from 'node-cron';
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 60 });

import {
  fetchGarminSummary,
  fetchWeeklySummary,
  fetchHistory,
  fetchActivityRoute,
  fetchRecentActivities,
  login,
} from './scraper';

const app = express();
const port = process.env.PORT || 3002;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/summary', async (req, res) => {
  try {
    const cached = cache.get("summary");
    if (cached) {
      res.json(cached);
      return;
    }

    const summary = await fetchGarminSummary();
    cache.set("summary", summary);
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
  let days = 7;
  if (req.query.days !== undefined) {
    days = Number(req.query.days);
    if (!Number.isInteger(days) || days <= 0 || days > 3650) {
      res.status(400).json({ error: 'Invalid days parameter' });
      return;
    }
  }
  try {
    const data = await fetchHistory(days);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to query InfluxDB' });
  }
});

app.get('/api/activities', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
  try {
    const acts = await fetchRecentActivities(limit);
    res.json(acts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

app.get('/api/activity/:id', async (req, res) => {
  try {
    const points = await fetchActivityRoute(req.params.id);
    res.json(points);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

if (require.main === module) {
  (async () => {
    try {
      await login();
    } catch (err) {
      console.error('Failed to login:', err);
      process.exit(1);
    }
    app.listen(port, () => {
      console.log(`API running at http://localhost:${port}`);
    });
    cron.schedule('0 0 * * *', () => {
      fetchGarminSummary().catch(err => console.error(err));
    });
  })();
}

export default app;
