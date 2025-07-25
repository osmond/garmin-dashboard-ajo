import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Spinner from '@/components/Spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useDashboardData from '@/hooks/useDashboardData'

export default function GoalsRing({ goal }: { goal?: number }) {
  const { data, isLoading, error } = useDashboardData()

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
        <svg width="120" height="120" className="mx-auto block">
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
