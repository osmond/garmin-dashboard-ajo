import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface ChartData {
  name: string
  steps: number
}

interface Props {
  data: ChartData[]
  goal?: number
}

export default function HistoryChart({ data, goal }: Props) {
  if (!data || !data.length) return null

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="stepsColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {goal && (
            <ReferenceLine
              y={goal}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
            />
          )}
          <Area type="monotone" dataKey="steps" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#stepsColor)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
