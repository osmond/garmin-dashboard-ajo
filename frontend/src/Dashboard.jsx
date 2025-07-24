import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setLoading(true)
      const res = await fetch('/api/summary')
      if (!res.ok) throw new Error(await res.text())
      setSummary(await res.json())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (error) return <p role="alert">Error: {error}</p>
  if (loading || !summary) return <p>Loading...</p>

  return (
    <main className="p-6 md:p-10 max-w-screen-sm mx-auto">
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
    </main>
  )
}
