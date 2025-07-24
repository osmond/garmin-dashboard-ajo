import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import StepsChart from '@/components/charts/StepsChart'
import RestingHRChart from '@/components/charts/RestingHRChart'
import Vo2MaxChart from '@/components/charts/Vo2MaxChart'
import SleepChart from '@/components/charts/SleepChart'

function movingAverage(data, window) {
  return data.map((_, idx) => {
    const start = Math.max(0, idx - window + 1)
    const subset = data.slice(start, idx + 1)
    const sum = subset.reduce((a, b) => a + b, 0)
    return sum / subset.length
  })
}

export default function InsightsPanel({ weekly }) {
  if (!weekly?.length) return null

  const data = weekly.map(d => ({
    date: new Date(d.time).toLocaleDateString(),
    ...d,
    intensity: d.steps / 100,
  }))

  const restMA = movingAverage(data.map(d => d.resting_hr), 3)
  const vo2MA = movingAverage(data.map(d => d.vo2max), 3)
  const sleepMA = movingAverage(data.map(d => d.sleep_hours), 3)

  data.forEach((d, i) => {
    d.resting_hr_ma = restMA[i]
    d.vo2max_ma = vo2MA[i]
    d.sleep_hours_ma = sleepMA[i]
  })

  const meanSteps = data.reduce((a, b) => a + b.steps, 0) / data.length
  const meanInt = data.reduce((a, b) => a + b.intensity, 0) / data.length
  const num = data.reduce(
    (sum, d) => sum + (d.steps - meanSteps) * (d.intensity - meanInt),
    0
  )
  const denom = Math.sqrt(
    data.reduce((s, d) => s + (d.steps - meanSteps) ** 2, 0) *
      data.reduce((s, d) => s + (d.intensity - meanInt) ** 2, 0)
  )
  const corr = denom ? num / denom : 0

  return (
    <Card className="insights">
      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SleepChart data={data.map(d => ({ date: d.date, sleep_hours: d.sleep_hours_ma }))} />
        <RestingHRChart data={data.map(d => ({ date: d.date, resting_hr: d.resting_hr_ma }))} />
        <Vo2MaxChart data={data.map(d => ({ date: d.date, vo2max: d.vo2max_ma }))} />
        <p>Steps vs intensity minutes correlation: {corr.toFixed(2)}</p>
      </CardContent>
    </Card>
  )
}
