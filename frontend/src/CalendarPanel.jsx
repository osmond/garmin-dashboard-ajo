import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

export default function CalendarPanel({ history }) {
  const [value, setValue] = useState(null)

  if (!history?.length) return null

  const dataMap = new Map(
    history.map(h => [new Date(h.time).toDateString(), h])
  )

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && dataMap.has(date.toDateString())) {
      return 'has-data'
    }
  }

  const selected = value && dataMap.get(value.toDateString())

  return (
    <div className="calendar-panel">
      <Calendar onChange={setValue} tileClassName={tileClassName} value={value} />
      {selected && (
        <ul className="daily-summary">
          <li><strong>Steps:</strong> {selected.steps}</li>
          <li><strong>Resting HR:</strong> {selected.resting_hr}</li>
          <li><strong>VO2 Max:</strong> {selected.vo2max}</li>
          <li><strong>Sleep:</strong> {selected.sleep_hours} hrs</li>
        </ul>
      )}
    </div>
  )
}
