import useMockData from './useMockData'
import useGarminData, { type Options } from './useGarminData'

export default function useDashboardData(options: Options = {}) {
  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
  const useData = isMock ? useMockData : useGarminData
  return useData(options)
}
