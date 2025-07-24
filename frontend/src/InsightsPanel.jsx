import {

  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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

  const labels = data.map(d => d.date)
  const sleep = data.map(d => d.sleep_hours)
  const resting = data.map(d => d.resting_hr)
  const vo2 = data.map(d => d.vo2max)
  const steps = data.map(d => d.steps)
  const intensity = data.map(d => d.intensity)

  const restMA = movingAverage(resting, 3)
  const vo2MA = movingAverage(vo2, 3)
  const sleepMA = movingAverage(sleep, 3)

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

  const chartData = data.map((d, idx) => ({
    date: d.date,
    sleep: d.sleep_hours,
    resting: d.resting_hr,
    restMA: restMA[idx],
    vo2MA: vo2MA[idx],
  }))

  return (

    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="sleep"
            stroke="rgba(255,99,132,1)"
            fill="rgba(255,99,132,0.1)"
          />
          <Area
            type="monotone"
            dataKey="resting"
            stroke="rgba(54,162,235,1)"
            fill="rgba(54,162,235,0.1)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p>Steps vs intensity minutes correlation: {corr.toFixed(2)}</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="restMA"
            stroke="rgba(75,192,192,1)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="vo2MA"
            stroke="rgba(153,102,255,1)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

  )
}
