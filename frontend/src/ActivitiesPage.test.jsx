import { render, screen } from '@testing-library/react'
import { vi as viFn, describe, it, expect } from 'vitest'

viFn.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>Tile</div>,
  Polyline: () => <div>Line</div>,
}))

viFn.mock('./RouteMap.jsx', () => ({ default: () => <div>Map</div> }))

describe('ActivitiesPage', () => {
  it('loads activities and route', async () => {
    const { default: ActivitiesPage } = await import('./pages/ActivitiesPage')
    global.fetch = viFn.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1', name: 'Run' }]),
        text: () => Promise.resolve(''),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ lat: 1, lon: 2 }]),
        text: () => Promise.resolve(''),
      })
    render(<ActivitiesPage />)
    await screen.findByText('Run')
    await screen.findByText('Map')
  })
})
