import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

export function useCurrentTime(): DateTime {
  const [now, setNow] = useState(() => DateTime.now())

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(DateTime.now())
    }, 1000)

    return () => window.clearInterval(id)
  }, [])

  return now
}
