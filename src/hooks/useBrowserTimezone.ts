import { useCallback, useEffect, useState } from 'react'
import { getBrowserTimezone } from '../utils/browserTimezone'

export function useBrowserTimezone(): string {
  const [timezone, setTimezone] = useState(getBrowserTimezone)

  const refresh = useCallback(() => {
    const detected = getBrowserTimezone()
    setTimezone((current) => (current === detected ? current : detected))
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', handleVisibility)

    const intervalId = window.setInterval(refresh, 60_000)

    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.clearInterval(intervalId)
    }
  }, [refresh])

  return timezone
}
