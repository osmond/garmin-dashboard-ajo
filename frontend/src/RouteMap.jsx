import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function RouteMap({ points }) {
  if (!points || points.length === 0) return null
  const center = [points[0].lat, points[0].lon]
  const line = points.map(p => [p.lat, p.lon])
  return (
    <MapContainer center={center} zoom={13} className="h-[400px] w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={line} />
    </MapContainer>
  )
}

export default RouteMap
