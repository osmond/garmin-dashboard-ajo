import { useState } from 'react'
import HistoryChart from '../HistoryChart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Spinner from '@/components/Spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useDashboardData from '@/hooks/useDashboardData'
import { Input } from '@/components/ui/input'

export default function HistoryTab() {
  const [days, setDays] = useState(30)
  const { data, isLoading, error } = useDashboardData({ historyDays: days })

  if (isLoading) return <Spinner />
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load dashboard data: {error}. Ensure your Garmin session is
          valid.
        </AlertDescription>
      </Alert>
    )
  }
  if (!data) return null

  const chartData = data.activities.map((entry) => ({
    name: new Date(entry.time).toLocaleDateString(),
    steps: entry.steps,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="number"
            min={1}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <HistoryChart data={chartData} goal={data.goals.steps} />
      </CardContent>
    </Card>
  )
}
