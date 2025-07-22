
// Placeholder scraper - Replace with real garminconnect logic
async function fetchGarminSummary() {
  return {
    steps: 9250,
    resting_hr: 57,
    vo2max: 48,
    sleep_hours: 6.5,
    stepsChart: {
      labels: [],
      datasets: [{
        label: "Steps",
        data: [],
        fill: true,
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        borderColor: "rgba(0, 123, 255, 1)",
        tension: 0.3
      }]
    }
  };
}

module.exports = { fetchGarminSummary };
