import { useEffect, useState } from 'react'

export default function SessionStatus() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/summary')
        if (!res.ok) throw new Error(await res.text())
      } catch {
        setMessage(
          'Garmin session expired or API unreachable. Run `npm run setup` to refresh your session.'
        )
      }
    }
    check()
  }, [])

  if (!message) return null

  return (
    <div className="rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">
      {message}
    </div>
  )
}
