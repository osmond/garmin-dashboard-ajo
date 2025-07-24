import { useEffect, useState } from 'react'
import RouteMap from '@/RouteMap'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [route, setRoute] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadActivities() {
    try {
      const res = await fetch('/api/activities')
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setActivities(data)
      setSelectedId(data[0]?.id ?? null)
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }

  async function loadRoute(id: string) {
    try {
      const res = await fetch(`/api/activity/${id}`)
      if (!res.ok) throw new Error(await res.text())
      setRoute(await res.json())
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  useEffect(() => {
    if (selectedId) {
      loadRoute(selectedId)
    }
  }, [selectedId])

  return (
    <main className="p-6 md:p-10 max-w-screen-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Recent Activities</h1>
      {error && <p role="alert">Error: {error}</p>}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Activity Routes</CardTitle>
          <Button size="sm" onClick={loadActivities}>Reload</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedId ?? ''} onValueChange={setSelectedId}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Choose an activity" />
            </SelectTrigger>
            <SelectContent>
              {activities.map(a => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {route && <RouteMap points={route} />}
        </CardContent>
      </Card>
    </main>
  )
}
