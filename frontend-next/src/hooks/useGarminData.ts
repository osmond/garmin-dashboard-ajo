import { useEffect, useState } from 'react'
import type { MockData } from './useMockData'

interface Options {
  historyDays?: number
  activityLimit?: number
}

export default function useGarminData(options: Options = {}) {
  const { historyDays = 7, activityLimit = 1 } = options
  const [data, setData] = useState<MockData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, historyRes, actsRes] = await Promise.all([
          fetch('/api/summary'),
          fetch(`/api/history?days=${historyDays}`),
          fetch(`/api/activities?limit=${activityLimit}`),
        ])

        if (!summaryRes.ok) throw new Error(await summaryRes.text())
        if (!historyRes.ok) throw new Error(await historyRes.text())
        if (!actsRes.ok) throw new Error(await actsRes.text())

        const summary = await summaryRes.json()
        const history: MockData['activities'] = await historyRes.json()
        const acts = await actsRes.json()

        let gps: MockData['gps'] | undefined
        if (Array.isArray(acts) && acts.length) {
          const coords: [number, number][] = []
          for (const act of acts) {
            const routeRes = await fetch(`/api/activity/${act.id}`)
            if (routeRes.ok) {
              const points: { lat: number; lon: number }[] = await routeRes.json()
              coords.push(
                ...points.map(p => [p.lat, p.lon] as [number, number])
              )
            }
          }
          gps = { coordinates: coords }
        }

        setData({
          metrics: summary,
          activities: history,
          goals: { steps: 10000, sleep_hours: 8 },
          gps: gps ?? { coordinates: [] },
          stepsHistory: history.map(d => d.steps),
          hrZones: [],
          sleepStages: [],
          vo2History: history.map(d => d.vo2max ?? 0),
        })
        setError(null)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [historyDays, activityLimit])

  return { data, isLoading, error }
}
