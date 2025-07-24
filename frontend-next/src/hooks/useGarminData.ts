import { useEffect, useState } from 'react'
import type { MockData } from './useMockData'

export default function useGarminData() {
  const [data, setData] = useState<MockData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, weeklyRes, actsRes] = await Promise.all([
          fetch('/api/summary'),
          fetch('/api/weekly'),
          fetch('/api/activities?limit=1'),
        ])

        if (!summaryRes.ok) throw new Error(await summaryRes.text())
        if (!weeklyRes.ok) throw new Error(await weeklyRes.text())
        if (!actsRes.ok) throw new Error(await actsRes.text())

        const summary = await summaryRes.json()
        const weekly = await weeklyRes.json()
        const acts = await actsRes.json()

        let gps
        if (Array.isArray(acts) && acts.length) {
          const routeRes = await fetch(`/api/activity/${acts[0].id}`)
          if (routeRes.ok) {
            const points: { lat: number; lon: number }[] = await routeRes.json()
            gps = {
              coordinates: points.map(p => [p.lat, p.lon] as [number, number]),
            }
          }
        }

        setData({
          metrics: summary,
          activities: weekly,
          goals: { steps: 10000, sleep_hours: 8 },
          gps,
          stepsHistory: weekly.map(d => d.steps),
          hrZones: [],
          sleepStages: [],
          vo2History: weekly.map(d => d.vo2max ?? 0),
        })
        setError(null)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return { data, isLoading, error }
}
