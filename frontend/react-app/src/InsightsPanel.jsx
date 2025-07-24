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

  const labels = weekly.map(d => new Date(d.time).toLocaleDateString())
  const sleep = weekly.map(d => d.sleep_hours)
  const resting = weekly.map(d => d.resting_hr)
  const vo2 = weekly.map(d => d.vo2max)
  const steps = weekly.map(d => d.steps)
  const intensity = steps.map(s => s / 100)

  const restMA = movingAverage(resting, 3)
  const vo2MA = movingAverage(vo2, 3)

  const meanSteps = steps.reduce((a, b) => a + b, 0) / steps.length
  const meanInt = intensity.reduce((a, b) => a + b, 0) / intensity.length
  const num = steps.reduce((sum, s, i) => sum + (s - meanSteps) * (intensity[i] - meanInt), 0)
  const denom = Math.sqrt(
    steps.reduce((sum, s) => sum + (s - meanSteps) ** 2, 0) *
      intensity.reduce((sum, x) => sum + (x - meanInt) ** 2, 0)
  )
  const corr = denom ? num / denom : 0

  const chartData = weekly.map((d, idx) => ({
    date: labels[idx],
    sleep: sleep[idx],
    resting: resting[idx],
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

