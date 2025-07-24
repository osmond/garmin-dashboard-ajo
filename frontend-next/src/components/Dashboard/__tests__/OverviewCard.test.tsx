import { render, screen } from '@testing-library/react'
import OverviewCard from '../OverviewCard'
import mockData from '@/data/mockData.json'

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockData,
  }) as jest.Mock
})

afterEach(() => {
  ;(global.fetch as jest.Mock).mockClear()
})

test('renders the step count from mockData', async () => {
  render(<OverviewCard />)
  const stepItem = await screen.findByText(String(mockData.metrics.steps))
  expect(stepItem).toBeInTheDocument()
})
