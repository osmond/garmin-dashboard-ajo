import { renderHook } from '@testing-library/react'
import useDashboardData from '../useDashboardData'
import useMockData from '../useMockData'
import useGarminData from '../useGarminData'

jest.mock('../useMockData')
jest.mock('../useGarminData')

const mockUseMockData = useMockData as jest.MockedFunction<typeof useMockData>
const mockUseGarminData = useGarminData as jest.MockedFunction<
  typeof useGarminData
>

describe('useDashboardData', () => {
  afterEach(() => {
    jest.resetAllMocks()
    delete process.env.NEXT_PUBLIC_MOCK_MODE
  })

  test('uses mock data when NEXT_PUBLIC_MOCK_MODE=true', () => {
    process.env.NEXT_PUBLIC_MOCK_MODE = 'true'
    mockUseMockData.mockReturnValue({
      data: 'mock',
      isLoading: false,
      error: null,
    } as any)
    const { result } = renderHook(() => useDashboardData())
    expect(result.current.data).toBe('mock')
    expect(mockUseMockData).toHaveBeenCalled()
    expect(mockUseGarminData).not.toHaveBeenCalled()
  })

  test('uses garmin data when NEXT_PUBLIC_MOCK_MODE is not true', () => {
    mockUseGarminData.mockReturnValue({
      data: 'live',
      isLoading: false,
      error: null,
    } as any)
    const { result } = renderHook(() => useDashboardData())
    expect(result.current.data).toBe('live')
    expect(mockUseGarminData).toHaveBeenCalled()
    expect(mockUseMockData).not.toHaveBeenCalled()
  })
})
