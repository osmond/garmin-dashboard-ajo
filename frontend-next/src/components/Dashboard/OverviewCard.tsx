import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Spinner from '@/components/Spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useMockData from '@/hooks/useMockData'
import useGarminData from '@/hooks/useGarminData'

export default function OverviewCard() {
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

  const { metrics, stepsHistory, hrZones, sleepStages, vo2History } = data

  if (
    stepsHistory.length === 0 &&
    hrZones.length === 0 &&
    sleepStages.length === 0 &&
    vo2History.length === 0
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Overview</CardTitle>
        </CardHeader>
        <CardContent>No data yet</CardContent>
      </Card>
    )
  }

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
            <span className="font-semibold">Resting HR:</span>{' '}
            {metrics.resting_hr}
          </li>
          <li>
            <span className="font-semibold">VO₂ Max:</span> {metrics.vo2max}
          </li>
          <li>
            <span className="font-semibold">Sleep:</span> {metrics.sleep_hours}{' '}
            hrs
          </li>
          <li>
            <span className="font-semibold">Steps History:</span>{' '}
            {stepsHistory.join(', ')}
          </li>
          <li>
            <span className="font-semibold">HR Zones:</span>{' '}
            {hrZones.join(', ')}
          </li>
          <li>
            <span className="font-semibold">Sleep Stages:</span>{' '}
            {sleepStages.join(', ')}
          </li>
          <li>
            <span className="font-semibold">VO₂ History:</span>{' '}
            {vo2History.join(', ')}
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
