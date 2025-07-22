import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js'
import './App.css'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler)

function App() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    fetch('/api/summary')
      .then(res => res.json())
      .then(setSummary)
      .catch(err => console.error(err))
  }, [])

  if (!summary) return <p>Loading...</p>

  return (
    <div className="dashboard">
      <h1>Garmin Dashboard</h1>
      <ul>
        <li><strong>Steps:</strong> {summary.steps}</li>
        <li><strong>Resting HR:</strong> {summary.resting_hr}</li>
        <li><strong>VO2 Max:</strong> {summary.vo2max}</li>
        <li><strong>Sleep:</strong> {summary.sleep_hours} hrs</li>
      </ul>
      <div className="chart-container">
        <Line data={summary.stepsChart} options={{ responsive: true }} />
      </div>
    </div>
  )
}

export default App
