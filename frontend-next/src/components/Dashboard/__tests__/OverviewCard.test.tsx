import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { beforeEach, afterEach, jest, test, expect } from '@jest/globals'
import OverviewCard from '../OverviewCard'
import mockData from '@/data/mockData.json'

beforeEach(() => {
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => mockData,
  } as unknown as Response)
  global.fetch = fetchMock
})

afterEach(() => {
  ;(global.fetch as jest.Mock).mockClear()
})

test('renders the step count from mockData', async () => {
  render(<OverviewCard />)
  const stepItem = await screen.findByText(String(mockData.metrics.steps))
  // @ts-expect-error Jest DOM extends expect
  expect(stepItem).toBeInTheDocument()
})
