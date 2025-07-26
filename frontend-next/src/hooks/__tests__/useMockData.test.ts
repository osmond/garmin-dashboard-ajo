import { renderHook, waitFor } from '@testing-library/react'
import useMockData from '../useMockData'
import mockData from '../../../public/mockData.json'

beforeEach(() => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockData,
  }) as jest.MockedFunction<typeof fetch>
  global.fetch = fetchMock
})

afterEach(() => {
  ;(global.fetch as jest.Mock).mockClear()
})

test('loads mock data from /mockData.json', async () => {
  const { result } = renderHook(() => useMockData())
  await waitFor(() => expect(result.current.isLoading).toBe(false))
  expect(global.fetch).toHaveBeenCalledWith('/mockData.json')
  expect(result.current.data).toEqual(mockData)
})
