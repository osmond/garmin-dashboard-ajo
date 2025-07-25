import { useEffect, useState } from 'react'
import mock from '../../public/mockData.json'

export type MockData = typeof mock

export default function useMockData() {
  const [data, setData] = useState<MockData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/mockData.json')
        if (!res.ok) throw new Error(await res.text())
        const json = (await res.json()) as MockData
        setData(json)
        setError(null)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return { data, isLoading, error }
}
