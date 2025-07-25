import { useState, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet.heat'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/Spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useMockData from '@/hooks/useMockData'
import useGarminData from '@/hooks/useGarminData'

interface HeatProps {
  points: [number, number][]
}

function HeatLayer({ points }: HeatProps) {
  const map = useMap()
  useEffect(() => {
    if (!map) return
    // leaflet.heat adds heatLayer to the global L namespace
    const layer = L.heatLayer(points, { radius: 25 })
    layer.addTo(map)
    return () => {
      map.removeLayer(layer)
    }
  }, [map, points])
  return null
}

export default function MapView() {
  const useData =
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ? useMockData : useGarminData
  const { data, isLoading, error } = useData({ activityLimit: 5 })
  const [heat, setHeat] = useState(false)

  if (isLoading) return <Spinner />
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load dashboard data</AlertDescription>
      </Alert>
    )
  }
  if (!data) return null

  const coords = (data.gps?.coordinates ?? []) as [number, number][]
  if (!coords.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Map View</CardTitle>
        </CardHeader>
        <CardContent>No activities yet</CardContent>
      </Card>
    )
  }

  const center: [number, number] = [coords[0][0], coords[0][1]]

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Map View</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setHeat((h) => !h)}>
          {heat ? 'Show Route' : 'Show Heatmap'}
        </Button>
      </CardHeader>
      <CardContent className="h-64">
        <MapContainer center={center} zoom={15} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {heat ? (
            <HeatLayer points={coords} />
          ) : (
            <>
              <Polyline positions={coords} color="blue" />
            </>
          )}
        </MapContainer>
      </CardContent>
    </Card>
  )
}
