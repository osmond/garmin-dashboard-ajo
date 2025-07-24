import { useEffect, useState } from 'react'

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

import CalendarPanel from '@/CalendarPanel'
import InsightsPanel from '@/InsightsPanel'
import ComparePanel from '@/ComparePanel'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

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
    <main className="p-6 md:p-10 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Garmin Dashboard</h1>

      <section className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarPanel history={history} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Key Metrics</CardTitle>
            <Button size="sm" onClick={loadData}>Reload</Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="font-semibold">Steps:</span> {summary.steps}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Progress value={(summary.steps / 10000) * 100} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Daily goal: 10k steps</TooltipContent>
                </Tooltip>
              </div>
              <Separator orientation="vertical" className="hidden sm:block" />
              <div className="space-y-1">
                <span className="font-semibold">Resting HR:</span> {summary.resting_hr}
              </div>
              <div className="space-y-1">
                <span className="font-semibold">VO₂ Max:</span> {summary.vo2max}
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="font-semibold">Sleep:</span> {summary.sleep_hours} hrs
                <Progress value={(summary.sleep_hours / 8) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="compare">Compare Metrics</TabsTrigger>
            </TabsList>
            <TabsContent value="insights">
              <InsightsPanel weekly={weekly} />
            </TabsContent>
            <TabsContent value="compare">
              <ComparePanel history={history} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}

