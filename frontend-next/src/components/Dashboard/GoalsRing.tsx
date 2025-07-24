import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Spinner from "@/components/Spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import useMockData from "@/hooks/useMockData"
import useGarminData from "@/hooks/useGarminData"

export default function GoalsRing({ goal }: { goal?: number }) {
  const useData =
    process.env.NEXT_PUBLIC_MOCK_MODE === 'false' ? useGarminData : useMockData
  const { data, isLoading, error } = useData()

  if (isLoading) return <Spinner />
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load dashboard data</AlertDescription>
      </Alert>
    )
  }
  if (!data) return null

  const steps = data.metrics.steps
  const stepGoal = goal ?? data.goals.steps
  const pct = Math.min((steps / stepGoal) * 100, 100)
  const radius = 52
  const circ = 2 * Math.PI * radius
  const offset = circ - (pct / 100) * circ

  return (
    <Card className="flex items-center justify-center">
      <CardHeader>
        <CardTitle>Daily Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <svg width="120" height="120" className="block mx-auto">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-xl font-semibold"
          >
            {Math.round(pct)}%
          </text>
        </svg>
      </CardContent>
    </Card>
  )
}
