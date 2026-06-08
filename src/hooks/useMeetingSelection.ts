import { useCallback, useState } from 'react'
import { DateTime } from 'luxon'
import { REFERENCE_ZONE } from '../constants/timezones'
import { getDefaultMeetingDateTime } from '../utils/timezone'

export function useMeetingSelection(now: DateTime) {
  const defaults = getDefaultMeetingDateTime(now)
  const [viewDate, setViewDate] = useState(defaults.date)
  const [selectedInstant, setSelectedInstant] = useState<DateTime | null>(() =>
    DateTime.fromISO(`${defaults.date}T${defaults.time}`, { zone: REFERENCE_ZONE }),
  )

  const selectInstant = useCallback((instant: DateTime) => {
    setSelectedInstant(instant)
    setViewDate(instant.setZone(REFERENCE_ZONE).toFormat('yyyy-MM-dd'))
  }, [])

  const selectReferenceTime = useCallback((date: string, time: string) => {
    const instant = DateTime.fromISO(`${date}T${time}`, { zone: REFERENCE_ZONE })
    if (instant.isValid) {
      setSelectedInstant(instant)
      setViewDate(date)
    }
  }, [])

  return {
    viewDate,
    setViewDate,
    selectedInstant,
    selectInstant,
    selectReferenceTime,
  }
}
