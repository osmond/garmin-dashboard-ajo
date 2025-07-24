/* global global */
import { render, screen } from '@testing-library/react';
import { vi as viFn, describe, it, expect } from 'vitest';

import App from './App';

viFn.mock('react-calendar', () => ({ default: () => <div>Calendar</div> }));

viFn.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>Tile</div>,
  Polyline: () => <div>Line</div>,
}));


describe('App', () => {
  it('renders data from API', async () => {
    const summary = {
      steps: 100,
      resting_hr: 60,
      vo2max: 50,
      sleep_hours: 8,
    };
    const weekly = [{
      time: '2024-01-01',
      steps: 100,
      resting_hr: 60,
      vo2max: 50,
      sleep_hours: 8,
    }];
    const history = weekly
    global.fetch = viFn.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(summary),
        text: () => Promise.resolve('')
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(weekly),
        text: () => Promise.resolve('')
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(history),
        text: () => Promise.resolve('')
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1', name: 'Run' }]),
        text: () => Promise.resolve('')
      });
    render(<App />);
    await screen.findByText('100');
    await screen.findByText(/Insights/);
    await screen.findByText(/Compare Metrics/);
  });

  it('shows error message if fetch fails', async () => {
    global.fetch = viFn.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
        text: () => Promise.resolve('')
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
        text: () => Promise.resolve('')
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
        text: () => Promise.resolve('')
      })

    render(<App />)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('fail')
  })
});
