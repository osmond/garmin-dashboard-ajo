import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Spinner from '@/components/Spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useMockData from '@/hooks/useMockData'
import useGarminData from '@/hooks/useGarminData'

export default function InsightsChart() {
  const useData =
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ? useMockData : useGarminData
  const { data, isLoading, error } = useData()

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

  if (data.stepsHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>No activities yet</CardContent>
      </Card>
    )
  }

  const chartData = data.stepsHistory.map((steps, i) => ({
    name: `Day ${i + 1}`,
    steps,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="steps"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
