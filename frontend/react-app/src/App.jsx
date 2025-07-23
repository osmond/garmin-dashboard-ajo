import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js'
import './App.css'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler)

function App() {
  const [summary, setSummary] = useState(null)
  const [weekly, setWeekly] = useState(null)

  useEffect(() => {
    fetch('/api/summary')
      .then(async res => {
        if (!res.ok) {
          throw new Error(await res.text())
        }
        return res.json()
      })
      .then(setSummary)
      .catch(err => console.error(err))
    fetch('/api/weekly')
      .then(async res => {
        if (!res.ok) {
          throw new Error(await res.text())
        }
        return res.json()
      })
      .then(setWeekly)
      .catch(err => console.error(err))
  }, [])

  if (!summary || !weekly) return <p>Loading...</p>

  return (
    <div className="dashboard">
      <h1>Garmin Dashboard</h1>
      <ul>
        <li><strong>Steps:</strong> {summary.steps}</li>
        <li><strong>Resting HR:</strong> {summary.resting_hr}</li>
        <li><strong>VO2 Max:</strong> {summary.vo2max}</li>
        <li><strong>Sleep:</strong> {summary.sleep_hours} hrs</li>
        <li><strong>Intensity Minutes:</strong> {summary.intensity_minutes}</li>
        <li><strong>Training Load:</strong> {summary.training_load}</li>
        <li><strong>Body Battery:</strong> {summary.body_battery}</li>
      </ul>
      <div className="chart-container">
        <Line
          data={summary.stepsChart}
          options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
        />
      </div>
      <div className="chart-container">
        <Line
          data={{
            labels: weekly.map(d => new Date(d.time).toLocaleDateString()),
            datasets: [{
              label: 'Steps',
              data: weekly.map(d => d.steps),
              fill: true,
              backgroundColor: 'rgba(40,167,69,0.1)',
              borderColor: 'rgba(40,167,69,1)',
              tension: 0.3,
            }],
          }}
          options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
        />
      </div>
    </div>
  )
}

export default App
