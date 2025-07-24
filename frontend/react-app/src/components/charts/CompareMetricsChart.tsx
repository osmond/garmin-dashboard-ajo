import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export interface CompareDatum {
  date: string
  [key: string]: number | string
}

interface Props {
  data: CompareDatum[]
  first: string
  second: string
  firstLabel: string
  secondLabel: string
}

export default function CompareMetricsChart({
  data,
  first,
  second,
  firstLabel,
  secondLabel,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={first} name={firstLabel} stroke="#f97316" />
        <Line type="monotone" dataKey={second} name={secondLabel} stroke="#10b981" />
      </LineChart>
    </ResponsiveContainer>
  )
}
