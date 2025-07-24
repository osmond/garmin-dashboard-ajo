import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Spinner from "@/components/Spinner"
import useMockData from "@/hooks/useMockData"

export default function OverviewCard() {
  const { data, isLoading } = useMockData()

  if (isLoading) return <Spinner />
  if (!data) return null

  const { metrics } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          <li>
            <span className="font-semibold">Steps:</span> {metrics.steps}
          </li>
          <li>
            <span className="font-semibold">Resting HR:</span> {metrics.resting_hr}
          </li>
          <li>
            <span className="font-semibold">VO₂ Max:</span> {metrics.vo2max}
          </li>
          <li>
            <span className="font-semibold">Sleep:</span> {metrics.sleep_hours} hrs
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
