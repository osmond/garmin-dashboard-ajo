import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js'

import RouteMap from './RouteMap.jsx'

import InsightsPanel from './InsightsPanel'
import ComparePanel from './ComparePanel'

import CalendarPanel from './CalendarPanel'
import { Button } from './components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './components/ui/select'
import { Input } from './components/ui/input'


import './App.css'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler)

function App() {
  const [summary, setSummary] = useState(null)
  const [weekly, setWeekly] = useState(null)

  const [history, setHistory] = useState(null)

  const [route, setRoute] = useState(null)
  const [activities, setActivities] = useState([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [activityId, setActivityId] = useState('')
  const [activityLimit, setActivityLimit] = useState(20)
  const [search, setSearch] = useState('')

  const [error, setError] = useState(null)

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
    fetch('/api/history?days=30')
      .then(async res => {
        if (!res.ok) {
          throw new Error(await res.text())
        }
        return res.json()
      })
      .then(setHistory)
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
    setActivitiesLoading(true)
    fetch(`/api/activities?limit=${activityLimit}`)
      .then(res => res.json())
      .then(data => {
        setActivities(data)
        if (data.length) setActivityId(data[0].id)
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => setActivitiesLoading(false))
  }, [activityLimit])

  function loadRoute(id = activityId) {
    setRoute(null)
    fetch(`/api/activity/${id}`)
      .then(res => res.json())
      .then(setRoute)
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
  }

  if (error) return <p role="alert">Error: {error}</p>
  if (!summary || !weekly || !history) return <p>Loading...</p>
  const filteredActivities = activities.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="dashboard">
      <CalendarPanel history={history} />
      <div>
        <h1>Garmin Dashboard</h1>
        <ul>
          <li><strong>Steps:</strong> {summary.steps}</li>
          <li><strong>Resting HR:</strong> {summary.resting_hr}</li>
          <li><strong>VO2 Max:</strong> {summary.vo2max}</li>
          <li><strong>Sleep:</strong> {summary.sleep_hours} hrs</li>
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


      <div className="route-loader">

        {activitiesLoading ? (
          <p>Loading activities...</p>
        ) : activities.length ? (
          <>
            <input
              type="number"
              min="1"
              value={activityLimit}
              onChange={e => setActivityLimit(Number(e.target.value))}
            />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {filteredActivities.length ? (
              <select
                value={activityId}
                onChange={e => {
                  const id = e.target.value
                  setActivityId(id)
                  loadRoute(id)
                }}
              >
                {filteredActivities.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} -
                    {a.date ? ` ${new Date(a.date).toLocaleDateString()}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <p>No matches</p>
            )}
          </>

        {activities.length ? (
          <Select value={activityId} onValueChange={setActivityId}>
            <SelectTrigger>
              <SelectValue placeholder="Select activity" />
            </SelectTrigger>
            <SelectContent>
              {activities.map(a => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name} - {a.date ? new Date(a.date).toLocaleDateString() : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        ) : (
          <Input
            value={activityId}
            onChange={e => setActivityId(e.target.value)}
            placeholder="Activity ID"
          />
        )}
        <Button onClick={loadRoute}>Load Route</Button>
      </div>

      <RouteMap points={route} />


      <InsightsPanel weekly={weekly} />
      <ComparePanel history={history} />

    </div>
  )
}

export default App
