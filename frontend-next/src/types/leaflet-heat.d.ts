declare module 'leaflet.heat' {
  import * as L from 'leaflet'
  export function heatLayer(
    latlngs: Array<[number, number]>,
    options?: unknown
  ): L.Layer
}
