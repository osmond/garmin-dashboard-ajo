/* global global */
import { render, screen } from '@testing-library/react'
import { vi as viFn, describe, it, expect } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders summary data', async () => {
    const summary = {
      steps: 100,
      resting_hr: 60,
      vo2max: 50,
      sleep_hours: 8,
    }
    const history = []
    global.fetch = viFn
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(summary),
        text: () => Promise.resolve(''),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(history),
        text: () => Promise.resolve(''),
      })
    render(<App />)
    await screen.findByText('100')
    await screen.findByText('60')
    await screen.findByText('50')
    await screen.findByText('8 hrs')
  })

  it('shows error message if fetch fails', async () => {
    global.fetch = viFn.fn().mockRejectedValue(new Error('fail'))
    render(<App />)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('fail')
  })
})
