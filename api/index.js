const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { fetchGarminSummary } = require('./importGarmin'); // assumes this function is exported

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/summary', async (req, res) => {
  try {
    const summary = await fetchGarminSummary(); // assumes this returns { steps, resting_hr, vo2max, sleep_hours, stepsChart }
    res.json(summary);
  } catch (err) {
    console.error('API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch Garmin summary' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
