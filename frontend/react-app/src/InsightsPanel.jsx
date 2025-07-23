import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler)

function movingAverage(data, window) {
  return data.map((_, idx) => {
    const start = Math.max(0, idx - window + 1)
    const subset = data.slice(start, idx + 1)
    const sum = subset.reduce((a, b) => a + b, 0)
    return sum / subset.length
  })
}

export default function InsightsPanel({ weekly }) {
  if (!weekly?.length) return null

  const labels = weekly.map(d => new Date(d.time).toLocaleDateString())
  const sleep = weekly.map(d => d.sleep_hours)
  const resting = weekly.map(d => d.resting_hr)
  const vo2 = weekly.map(d => d.vo2max)
  const steps = weekly.map(d => d.steps)
  const intensity = steps.map(s => s / 100)

  const restMA = movingAverage(resting, 3)
  const vo2MA = movingAverage(vo2, 3)

  const meanSteps = steps.reduce((a, b) => a + b, 0) / steps.length
  const meanInt = intensity.reduce((a, b) => a + b, 0) / intensity.length
  const num = steps.reduce((sum, s, i) => sum + (s - meanSteps) * (intensity[i] - meanInt), 0)
  const denom = Math.sqrt(
    steps.reduce((sum, s) => sum + (s - meanSteps) ** 2, 0) *
      intensity.reduce((sum, x) => sum + (x - meanInt) ** 2, 0)
  )
  const corr = denom ? num / denom : 0

  return (
    <aside className="insights">
      <h2>Insights</h2>
      <div className="chart-container">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'Sleep (hrs)',
                data: movingAverage(sleep, 3),
                borderColor: 'rgba(255,99,132,1)',
                backgroundColor: 'rgba(255,99,132,0.1)',
                tension: 0.3,
                fill: true,
              },
              {
                label: 'Resting HR',
                data: restMA,
                borderColor: 'rgba(54,162,235,1)',
                backgroundColor: 'rgba(54,162,235,0.1)',
                tension: 0.3,
                fill: true,
              },
            ],
          }}
          options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
        />
      </div>
      <p>Steps vs intensity minutes correlation: {corr.toFixed(2)}</p>
      <div className="chart-container">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'Resting HR MA',
                data: restMA,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.1)',
                tension: 0.3,
                fill: true,
              },
            ],
          }}
          options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
        />
      </div>
      <div className="chart-container">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'VO2 Max MA',
                data: vo2MA,
                borderColor: 'rgba(153,102,255,1)',
                backgroundColor: 'rgba(153,102,255,0.1)',
                tension: 0.3,
                fill: true,
              },
            ],
          }}
          options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
        />
      </div>
    </aside>
  )
}

