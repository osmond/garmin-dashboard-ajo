import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { beforeEach, afterEach, jest, test, expect } from '@jest/globals'
import mockData from '../../../../public/mockData.json'
import useDashboardData from '../../../hooks/useDashboardData'
import OverviewCard from '../OverviewCard'

beforeEach(() => {
  process.env.NEXT_PUBLIC_MOCK_MODE = 'true'
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => mockData,
  } as unknown as Response)
  global.fetch = fetchMock
})

afterEach(() => {
  ;(global.fetch as jest.Mock).mockClear()
  delete process.env.NEXT_PUBLIC_MOCK_MODE
})

test('renders the step count from mockData', async () => {
  render(<OverviewCard />)
  const stepItem = await screen.findByText(String(mockData.metrics.steps))
  // @ts-expect-error Jest DOM extends expect
  expect(stepItem).toBeInTheDocument()
})
