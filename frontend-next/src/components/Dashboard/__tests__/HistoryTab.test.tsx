import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import HistoryTab from '../HistoryTab'
import '@testing-library/jest-dom'
import { beforeEach, afterEach, jest, test, expect } from '@jest/globals'

beforeEach(() => {
  jest.useFakeTimers()
  const fetchMock = jest.fn((url: string) => {
    const body = url.includes('history') ? [] : {}
    return Promise.resolve({
      ok: true,
      json: async () => body,
    } as Response)
  }) as jest.MockedFunction<typeof fetch>
  global.fetch = fetchMock
})

afterEach(() => {
  jest.useRealTimers()
  ;(global.fetch as jest.Mock).mockClear()
})

test('debounces data fetches when days change rapidly', async () => {
  render(<HistoryTab />)
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3))
  const input = await screen.findByRole('spinbutton')

  await act(async () => {
    fireEvent.change(input, { target: { value: '5' } })
    fireEvent.change(input, { target: { value: '10' } })
  })

  expect(global.fetch).toHaveBeenCalledTimes(3)

  await act(async () => {
    jest.advanceTimersByTime(300)
  })

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(6))
})
