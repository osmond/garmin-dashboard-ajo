import { useState } from 'react'
import CompareMetricsChart from '@/components/charts/CompareMetricsChart'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'

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
    <Card className="compare-panel">
      <CardHeader>
        <CardTitle>Compare Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <div className="chart-container">
          <CompareMetricsChart
            data={data}
            first={first}
            second={second}
            firstLabel={fields.find(f => f.key === first).label}
            secondLabel={fields.find(f => f.key === second).label}
          />
        </div>
      </CardContent>
    </Card>
  )
}
