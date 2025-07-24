import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export interface Vo2Datum {
  date: string
  vo2max: number
}

export default function Vo2MaxChart({ data }: { data: Vo2Datum[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="vo2max" stroke="#8b5cf6" />
      </LineChart>
    </ResponsiveContainer>
  )
}
