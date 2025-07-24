import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './components/ui/select'

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

  const data = history.map(d => ({
    date: new Date(d.time).toLocaleDateString(),
    ...d,
  }))

  return (
    <div className="space-y-4">
      <div className="selectors flex gap-2">
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
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={first}
            stroke="rgba(255,159,64,1)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey={second}
            stroke="rgba(75,192,192,1)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}