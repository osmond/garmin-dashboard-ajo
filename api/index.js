const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/summary', (req, res) => {
  res.json({
    steps: 8430,
    resting_hr: 52,
    vo2max: 47.1,
    sleep_hours: 7.4,
    stepsChart: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Steps',
          data: [7800, 8200, 8600, 9000, 8800, 10200, 8430],
          fill: true,
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderColor: 'rgba(0, 123, 255, 1)',
          tension: 0.3
        }
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
