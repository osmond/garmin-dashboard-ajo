// Simulated Garmin scraping logic
async function fetchGarminSummary() {
  return {
    steps: 8021,
    resting_hr: 57,
    vo2max: 49,
    sleep_hours: 6.9,
    stepsChart: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Steps',
          data: [7000, 8500, 9000, 7500, 8000, 10000, 8200],
          fill: true,
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderColor: 'rgba(0, 123, 255, 1)',
          tension: 0.3,
        },
      ],
    },
  };
}

module.exports = { fetchGarminSummary };
