import { render, screen } from '@testing-library/react'
import GoalsRing from '../GoalsRing'
import useDashboardData from '../../../hooks/useDashboardData'

jest.mock('../../../hooks/useDashboardData')

const mockUseDashboardData = useDashboardData as jest.MockedFunction<
  typeof useDashboardData
>

const baseData = {
  metrics: { steps: 5000 },
  goals: { steps: 10000 },
  activities: [],
  gps: { coordinates: [] },
  stepsHistory: [],
  hrZones: [],
  sleepStages: [],
  vo2History: [],
}

describe('GoalsRing', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('shows percentage of goal achieved', () => {
    mockUseDashboardData.mockReturnValue({
      data: baseData,
      isLoading: false,
      error: null,
    })
    render(<GoalsRing />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  test('renders loading state', () => {
    mockUseDashboardData.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })
    const { container } = render(<GoalsRing />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  test('renders error state', () => {
    mockUseDashboardData.mockReturnValue({
      data: null,
      isLoading: false,
      error: 'oops',
    })
    render(<GoalsRing />)
    expect(
      screen.getByText(/failed to load dashboard data/i)
    ).toBeInTheDocument()
  })
})
