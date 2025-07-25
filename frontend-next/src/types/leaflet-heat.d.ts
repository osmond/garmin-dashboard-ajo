import * as L from 'leaflet'

declare module 'leaflet' {
  function heatLayer(
    latlngs: Array<[number, number]>,
    options?: unknown
  ): L.Layer
}
