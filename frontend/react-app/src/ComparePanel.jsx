import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './components/ui/select'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler)

const fields = [
  { key: 'steps', label: 'Steps' },
  { key: 'resting_hr', label: 'Resting HR' },
  { key: 'vo2max', label: 'VO2 Max' },
  { key: 'sleep_hours', label: 'Sleep (hrs)' }
]

export default function ComparePanel({ history }) {
  const [first, setFirst] = useState(fields[0].key)
  const [second, setSecond] = useState(fields[1].key)

  if (!history?.length) return null

  const labels = history.map(d => new Date(d.time).toLocaleDateString())

  const dataset = key => history.map(d => d[key])

  return (
    <div className="compare-panel">
      <h2>Compare Metrics</h2>
      <div className="selectors">
        <Select value={first} onValueChange={setFirst}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fields.map(f => (
              <SelectItem key={f.key} value={f.key}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={second} onValueChange={setSecond}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fields.map(f => (
              <SelectItem key={f.key} value={f.key}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="chart-container">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: fields.find(f => f.key === first).label,
                data: dataset(first),
                borderColor: 'rgba(255,159,64,1)',
                backgroundColor: 'rgba(255,159,64,0.1)',
                tension: 0.3,
                fill: true,
              },
              {
                label: fields.find(f => f.key === second).label,
                data: dataset(second),
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
    </div>
  )
}
