import { DateTime } from 'luxon'
import type { TimezoneDisplay, WorkingHoursStatus } from '../types/timezone'

export function getWorkingHoursStatus(hour: number): WorkingHoursStatus {
  if (hour >= 9 && hour < 18) return 'working'
  if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 21)) return 'transition'
  return 'sleeping'
}

export function formatTimezoneDisplay(dt: DateTime): TimezoneDisplay {
  return {
    time: dt.toFormat('HH:mm:ss'),
    date: dt.toFormat('EEE, MMM d'),
    abbreviation: dt.offsetNameShort ?? dt.toFormat('ZZZZ'),
    offset: dt.toFormat('ZZ'),
    status: getWorkingHoursStatus(dt.hour),
  }
}

export function getNowInZone(zone: string, now: DateTime): TimezoneDisplay {
  return formatTimezoneDisplay(now.setZone(zone))
}

export function convertFromReference(
  referenceDt: DateTime,
  targetZone: string,
): TimezoneDisplay {
  const converted = referenceDt.setZone(targetZone, { keepLocalTime: false })
  return formatTimezoneDisplay(converted)
}

export const QUARTER_HOUR_MINUTES = ['00', '15', '30', '45'] as const

export function snapMinuteToQuarter(minute: string): (typeof QUARTER_HOUR_MINUTES)[number] {
  const parsed = Number.parseInt(minute, 10)
  if (Number.isNaN(parsed)) return '00'

  const snapped = Math.round(parsed / 15) * 15
  const normalized = snapped === 60 ? 0 : snapped
  return QUARTER_HOUR_MINUTES[normalized / 15] ?? '00'
}

export function snapTimeToQuarterHour(time: string): string {
  const [hour = '00', minute = '00'] = time.split(':')
  const snappedMinute = snapMinuteToQuarter(minute)
  const hourValue = Number.parseInt(hour, 10)

  if (snappedMinute === '00' && minute !== '00' && Number.parseInt(minute, 10) > 52) {
    const nextHour = Number.isNaN(hourValue) ? 0 : (hourValue + 1) % 24
    return `${nextHour.toString().padStart(2, '0')}:00`
  }

  return `${hour.padStart(2, '0')}:${snappedMinute}`
}

export function roundToQuarterHour(dt: DateTime): DateTime {
  const totalMinutes = dt.hour * 60 + dt.minute
  const roundedTotal = Math.ceil(totalMinutes / 15) * 15
  return dt.startOf('day').plus({ minutes: roundedTotal })
}

export function parseReferenceDateTime(date: string, time: string): DateTime {
  const snappedTime = snapTimeToQuarterHour(time)
  return DateTime.fromISO(`${date}T${snappedTime}`, { zone: 'Asia/Bangkok' })
}

export function getDefaultMeetingDateTime(now: DateTime): { date: string; time: string } {
  const rounded = roundToQuarterHour(now.setZone('Asia/Bangkok').plus({ hours: 1 }))
  return {
    date: rounded.toFormat('yyyy-MM-dd'),
    time: rounded.toFormat('HH:mm'),
  }
}
