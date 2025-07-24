import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Spinner from "@/components/Spinner"
import useMockData from "@/hooks/useMockData"
import useGarminData from "@/hooks/useGarminData"

export default function InsightsChart() {
  const useData =
    process.env.NEXT_PUBLIC_MOCK_MODE === 'false' ? useGarminData : useMockData
  const { data, isLoading } = useData()

  if (isLoading) return <Spinner />
  if (!data) return null

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
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="steps" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
