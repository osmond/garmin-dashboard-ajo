'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Summary {
  steps: number
  resting_hr: number
  vo2max: number
  sleep_hours: number
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [range, setRange] = useState('7')

  const loadSummary = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/summary')
      if (!res.ok) throw new Error(await res.text())
      const data = (await res.json()) as Summary
      setSummary(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
  }, [])

  if (loading) return <p className="p-4">Loading...</p>
  if (error) return <p role="alert" className="p-4 text-destructive">Error: {error}</p>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Garmin Dashboard</h1>
      <div className="flex gap-4 items-center">
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={loadSummary}>Refresh</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Steps</CardTitle>
          </CardHeader>
          <CardContent>{summary?.steps}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Resting HR</CardTitle>
          </CardHeader>
          <CardContent>{summary?.resting_hr}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">VO2 Max</CardTitle>
          </CardHeader>
          <CardContent>{summary?.vo2max}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Sleep (hrs)</CardTitle>
          </CardHeader>
          <CardContent>{summary?.sleep_hours}</CardContent>
        </Card>
      </div>
    </div>
  )
}
