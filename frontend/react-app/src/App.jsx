import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js'
import './App.css'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler)

function App() {
  const [summary, setSummary] = useState(null)
  const [weekly, setWeekly] = useState(null)
  const [error, setError] = useState(null)
  const [stepGoal, setStepGoal] = useState(() => Number(localStorage.getItem('stepGoal')) || 7000)
  const [sleepGoal, setSleepGoal] = useState(() => Number(localStorage.getItem('sleepGoal')) || 8)
  const [hrGoal, setHrGoal] = useState(() => Number(localStorage.getItem('hrGoal')) || 120)

  useEffect(() => {
    localStorage.setItem('stepGoal', stepGoal)
  }, [stepGoal])
  useEffect(() => {
    localStorage.setItem('sleepGoal', sleepGoal)
  }, [sleepGoal])
  useEffect(() => {
    localStorage.setItem('hrGoal', hrGoal)
  }, [hrGoal])

  useEffect(() => {
    fetch('/api/summary')
      .then(async res => {
        if (!res.ok) {
          throw new Error(await res.text())
        }
        return res.json()
      })
      .then(setSummary)
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
    fetch('/api/weekly')
      .then(async res => {
        if (!res.ok) {
          throw new Error(await res.text())
        }
        return res.json()
      })
      .then(setWeekly)
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
  }, [])

  const stepStreak = weekly
    ? (() => {
        let count = 0
        for (let i = weekly.length - 1; i >= 0; i--) {
          if (weekly[i].steps >= stepGoal) count++
          else break
        }
        return count
      })()
    : 0

  if (error) return <p role="alert">Error: {error}</p>
  if (!summary || !weekly) return <p>Loading...</p>

  return (
    <div className="dashboard">
      <h1>Garmin Dashboard</h1>
      {stepStreak >= 2 && (
        <p className="celebration" role="status">
          🎉 {stepStreak} day step streak over {stepGoal}!
        </p>
      )}
      <div className="goals">
        <h2>Goals</h2>
        <label>
          Step Goal:{' '}
          <input
            type="number"
            value={stepGoal}
            onChange={e => setStepGoal(Number(e.target.value))}
          />
        </label>
        <label>
          Sleep Goal (hrs):{' '}
          <input
            type="number"
            value={sleepGoal}
            onChange={e => setSleepGoal(Number(e.target.value))}
          />
        </label>
        <label>
          HR Zone Goal:{' '}
          <input
            type="number"
            value={hrGoal}
            onChange={e => setHrGoal(Number(e.target.value))}
          />
        </label>
      </div>
      <ul>
        <li><strong>Steps:</strong> {summary.steps} / {stepGoal}</li>
        <li><strong>Resting HR:</strong> {summary.resting_hr} / {hrGoal}</li>
        <li><strong>VO2 Max:</strong> {summary.vo2max}</li>
        <li><strong>Sleep:</strong> {summary.sleep_hours} / {sleepGoal} hrs</li>
      </ul>
      
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
