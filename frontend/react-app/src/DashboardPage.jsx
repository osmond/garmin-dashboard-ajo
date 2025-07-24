import { useEffect, useState } from 'react'
import CalendarPanel from './CalendarPanel'
import InsightsPanel from './InsightsPanel'
import ComparePanel from './ComparePanel'
import "./App.css"

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [weekly, setWeekly] = useState(null)
  const [history, setHistory] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/summary')
      .then(async res => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then(setSummary)
      .catch(err => {
        console.error(err)
        setError(err.message)
      })

    fetch('/api/weekly')
      .then(async res => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then(setWeekly)
      .catch(err => {
        console.error(err)
        setError(err.message)
      })

    fetch('/api/history?days=30')
      .then(async res => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then(setHistory)
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
  }, [])

  if (error) return <p role="alert">Error: {error}</p>
  if (!summary || !weekly || !history) return <p>Loading...</p>

  return (
    <div className="dashboard">
      <CalendarPanel history={history} />
      <div className="dashboard-main">
        <h1>Garmin Dashboard</h1>
        <ul className="key-metrics">
          <li><strong>Steps:</strong> {summary.steps}</li>
          <li><strong>Resting HR:</strong> {summary.resting_hr}</li>
          <li><strong>VO2 Max:</strong> {summary.vo2max}</li>
          <li><strong>Sleep:</strong> {summary.sleep_hours} hrs</li>
        </ul>
        <InsightsPanel weekly={weekly} />
        <ComparePanel history={history} />
      </div>
    </div>
  )
}
