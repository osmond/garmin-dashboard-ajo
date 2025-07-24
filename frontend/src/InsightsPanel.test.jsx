import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi as viFn } from 'vitest'

viFn.mock('recharts', () => ({
  AreaChart: ({ children }) => <svg data-testid="area-chart">{children}</svg>,
  Area: () => <g />,
  LineChart: ({ children }) => <svg data-testid="line-chart">{children}</svg>,
  Line: () => <g />,
  XAxis: () => <g />,
  YAxis: () => <g />,
  Tooltip: () => <div>Tooltip</div>,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}))

describe('InsightsPanel', () => {
  it('renders charts for weekly data', async () => {
    const { default: InsightsPanel } = await import('./InsightsPanel')
    const weekly = [
      { time: '2024-01-01', steps: 100, resting_hr: 60, vo2max: 50, sleep_hours: 8 },
      { time: '2024-01-02', steps: 200, resting_hr: 62, vo2max: 51, sleep_hours: 7 },
      { time: '2024-01-03', steps: 150, resting_hr: 64, vo2max: 52, sleep_hours: 6 },
    ]
    render(<InsightsPanel weekly={weekly} />)
    expect(screen.getByText(/Steps vs intensity/)).toBeInTheDocument()
    expect(screen.getAllByTestId('area-chart').length).toBe(1)
    expect(screen.getAllByTestId('line-chart').length).toBe(2)
  })
})
