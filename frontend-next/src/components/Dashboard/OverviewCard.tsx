import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import useMockData from "@/hooks/useMockData"

export default function OverviewCard() {
  const { data, isLoading } = useMockData()

  if (isLoading || !data) return null

  const { summary } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          <li>
            <span className="font-semibold">Steps:</span> {summary.steps}
          </li>
          <li>
            <span className="font-semibold">Resting HR:</span> {summary.resting_hr}
          </li>
          <li>
            <span className="font-semibold">VO₂ Max:</span> {summary.vo2max}
          </li>
          <li>
            <span className="font-semibold">Sleep:</span> {summary.sleep_hours} hrs
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
