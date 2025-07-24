import { useEffect, useState } from 'react'

import { Card, CardHeader, CardContent } from '@/components/ui/card'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import CalendarPanel from '@/CalendarPanel'
import InsightsPanel from '@/InsightsPanel'
import ComparePanel from '@/ComparePanel'
import { Button } from '@/components/ui/button'
import StepsChart from '@/components/charts/StepsChart'
import RestingHRChart from '@/components/charts/RestingHRChart'
import Vo2MaxChart from '@/components/charts/Vo2MaxChart'
import SleepChart from '@/components/charts/SleepChart'

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
    <main className="p-6 md:p-10 max-w-screen-xl mx-auto bg-background text-foreground">
      <h1 className="text-2xl font-semibold mb-6">Garmin Dashboard</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Calendar</h3>
          </CardHeader>
          <CardContent>
            <CalendarPanel history={history} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Key Metrics</h3>
            <Button size="sm" onClick={loadData}>Reload</Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-semibold">Steps:</span> {summary.steps}
            </div>
            <div>
              <span className="font-semibold">Resting HR:</span> {summary.resting_hr}
            </div>
            <div>
              <span className="font-semibold">VO₂ Max:</span> {summary.vo2max}
            </div>
            <div>
              <span className="font-semibold">Sleep:</span> {summary.sleep_hours} hrs
            </div>
          </CardContent>
        </Card>
      </section>


      <section className="grid md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Insights</h3>
          </CardHeader>
          <CardContent>
            <InsightsPanel weekly={weekly} />

          </CardContent>
        </Card>
        <Card>
          <CardHeader>

            <h3 className="text-lg font-semibold">Compare Metrics</h3>
          </CardHeader>
          <CardContent>
            <ComparePanel history={history} />
          </CardContent>
        </Card>

      </section>
    </main>
  )
}

