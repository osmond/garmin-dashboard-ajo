import { render, screen } from '@testing-library/react'
import ActivitiesTable from '../ActivitiesTable'
import useDashboardData from '../../../hooks/useDashboardData'

jest.mock('../../../hooks/useDashboardData')

const mockUseDashboardData = useDashboardData as jest.MockedFunction<
  typeof useDashboardData
>

const baseData = {
  metrics: { steps: 0 },
  goals: { steps: 10000 },
  activities: [
    {
      time: '2024-05-01T00:00:00Z',
      steps: 1000,
      resting_hr: 60,
      vo2max: 50,
      sleep_hours: 7,
    },
  ],
  gps: { coordinates: [] },
  stepsHistory: [],
  hrZones: [],
  sleepStages: [],
  vo2History: [],
}

describe('ActivitiesTable', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('shows message when no activities', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, activities: [] },
      isLoading: false,
      error: null,
    })
    render(<ActivitiesTable />)
    expect(screen.getByText(/no activities yet/i)).toBeInTheDocument()
  })

  test('renders table rows for activities', () => {
    mockUseDashboardData.mockReturnValue({
      data: baseData,
      isLoading: false,
      error: null,
    })
    render(<ActivitiesTable />)
    expect(screen.getByText('1000')).toBeInTheDocument()
    expect(screen.getByText('HR: 60', { exact: false })).toBeInTheDocument()
  })
})
