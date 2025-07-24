import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import HistoryChart from '@/components/HistoryChart'
import useMockData from '@/hooks/useMockData'

interface Summary {
  steps: number
  resting_hr: number
  vo2max: number
  sleep_hours: number
}

interface HistoryEntry {
  time: string
  steps: number
}

export default function Dashboard() {
  const mockEnabled = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
  const { data: mockData, isLoading: mockLoading, error: mockError } =
    useMockData()

  const [summary, setSummary] = useState<Summary | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setLoading(true)
      const [summaryRes, historyRes] = await Promise.all([
        fetch('/api/summary'),
        fetch('/api/weekly'),
      ])
      if (!summaryRes.ok) throw new Error(await summaryRes.text())
      if (!historyRes.ok) throw new Error(await historyRes.text())
      setSummary(await summaryRes.json())
      setHistory(await historyRes.json())
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!mockEnabled) load()
  }, [mockEnabled])

  if (mockEnabled) {
    if (mockError) return <p role="alert">Error: {mockError}</p>
    if (mockLoading || !mockData) return <p>Loading...</p>
    const chartData = mockData.weekly.map(d => ({
      name: new Date(d.time).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      steps: d.steps,
    }))
    return (
      <main className="p-6 md:p-10 max-w-screen-sm mx-auto space-y-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Daily Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              <li><span className="font-semibold">Steps:</span> {mockData.summary.steps}</li>
              <li><span className="font-semibold">Resting HR:</span> {mockData.summary.resting_hr}</li>
              <li><span className="font-semibold">VO₂ Max:</span> {mockData.summary.vo2max}</li>
              <li><span className="font-semibold">Sleep:</span> {mockData.summary.sleep_hours} hrs</li>
            </ul>
          </CardContent>
        </Card>
        <HistoryChart data={chartData} />
      </main>
    )
  }

  if (error) return <p role="alert">Error: {error}</p>
  if (loading || !summary) return <p>Loading...</p>

  const chartData = history.map(d => ({
    name: new Date(d.time).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    }),
    steps: d.steps
  }))

  return (
    <main className="p-6 md:p-10 max-w-screen-sm mx-auto space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Daily Summary</CardTitle>
          <Button size="sm" onClick={load}>Reload</Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            <li><span className="font-semibold">Steps:</span> {summary.steps}</li>
            <li><span className="font-semibold">Resting HR:</span> {summary.resting_hr}</li>
            <li><span className="font-semibold">VO₂ Max:</span> {summary.vo2max}</li>
            <li><span className="font-semibold">Sleep:</span> {summary.sleep_hours} hrs</li>
          </ul>
        </CardContent>
      </Card>
      <HistoryChart data={chartData} />
    </main>
  )
}
