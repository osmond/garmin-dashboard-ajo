import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import CalendarPanel from '@/CalendarPanel'
import InsightsPanel from '@/InsightsPanel'
import ComparePanel from '@/ComparePanel'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null)
  const [weekly, setWeekly] = useState<any>(null)
  const [history, setHistory] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadData() {
    try {
      const [sRes, wRes, hRes] = await Promise.all([
        fetch('/api/summary'),
        fetch('/api/weekly'),
        fetch('/api/history?days=30'),
      ])
      if (!sRes.ok) throw new Error(await sRes.text())
      if (!wRes.ok) throw new Error(await wRes.text())
      if (!hRes.ok) throw new Error(await hRes.text())
      const [sData, wData, hData] = await Promise.all([
        sRes.json(),
        wRes.json(),
        hRes.json(),
      ])
      setSummary(sData)
      setWeekly(wData)
      setHistory(hData)
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (error) return <p role="alert">Error: {error}</p>
  if (!summary || !weekly || !history) return <p>Loading...</p>

  return (
    <main className="p-4 bg-background min-h-screen text-foreground">
      <h1 className="text-2xl font-bold mb-4">Garmin Dashboard</h1>

      <section className="mb-6">
        <CalendarPanel history={history} />
      </section>

      <section className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Key Metrics</h2>
            <Button size="sm" onClick={loadData}>Reload</Button>
          </div>
          <ul className="grid grid-cols-2 gap-2">
            <li><strong>Steps:</strong> {summary.steps}</li>
            <li><strong>Resting HR:</strong> {summary.resting_hr}</li>
            <li><strong>VO2 Max:</strong> {summary.vo2max}</li>
            <li><strong>Sleep:</strong> {summary.sleep_hours} hrs</li>
          </ul>
        </Card>
        <InsightsPanel weekly={weekly} />
      </section>

      <section className="mb-6">
        <ComparePanel history={history} />
      </section>
    </main>
  )
}

