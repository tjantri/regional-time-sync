import { DateTime } from 'luxon'
import type { WorkingHoursStatus } from '../types/timezone'
import { getWorkingHoursStatus } from './timezone'

export const TIMELINE_HOURS = 24

export interface TimelineHourBlock {
  index: number
  instant: DateTime
  localHour: number
  label: string
  status: WorkingHoursStatus
  isCurrent: boolean
}

export interface SelectionCellInfo {
  timeLabel: string
  dayOffset: number
  status: WorkingHoursStatus
  fullLabel: string
}

export function getOffsetHoursFromReference(
  zone: string,
  referenceZone: string,
  instant: DateTime,
): number {
  const referenceOffset = instant.setZone(referenceZone).offset
  const zoneOffset = instant.setZone(zone).offset
  return (zoneOffset - referenceOffset) / 60
}

export function formatOffsetLabel(hours: number): string {
  if (hours === 0) return '±0'
  return hours > 0 ? `+${hours}` : `${hours}`
}

export function getReferenceDayStart(viewDate: string, referenceZone: string): DateTime {
  return DateTime.fromISO(viewDate, { zone: referenceZone }).startOf('day')
}

export function getSelectionColumnIndex(
  selectedInstant: DateTime | null,
  viewDate: string,
  referenceZone: string,
): number | null {
  if (!selectedInstant) return null

  const reference = selectedInstant.setZone(referenceZone)
  const viewStart = getReferenceDayStart(viewDate, referenceZone)
  const viewEnd = viewStart.plus({ days: 1 })

  if (reference < viewStart || reference >= viewEnd) return null

  return reference.hour
}

export function getSelectionCellInfo(
  selectedInstant: DateTime,
  zone: string,
  referenceZone: string,
): SelectionCellInfo {
  const local = selectedInstant.setZone(zone)
  const reference = selectedInstant.setZone(referenceZone)
  const dayOffset = Math.round(
    local.startOf('day').diff(reference.startOf('day'), 'days').days,
  )

  return {
    timeLabel: local.toFormat('ha').toLowerCase(),
    dayOffset,
    status: getWorkingHoursStatus(local.hour),
    fullLabel: local.toFormat('ccc, MMM d · h:mm a'),
  }
}

export function buildTimelineHours(
  zone: string,
  viewDate: string,
  referenceZone: string,
  now: DateTime,
): TimelineHourBlock[] {
  const referenceDayStart = getReferenceDayStart(viewDate, referenceZone)

  return Array.from({ length: TIMELINE_HOURS }, (_, index) => {
    const instant = referenceDayStart.plus({ hours: index })
    const local = instant.setZone(zone)

    return {
      index,
      instant,
      localHour: local.hour,
      label: local.toFormat('ha').toLowerCase(),
      status: getWorkingHoursStatus(local.hour),
      isCurrent: now.setZone(zone).hasSame(instant, 'hour'),
    }
  })
}

export function instantFromReferenceHour(
  viewDate: string,
  referenceZone: string,
  hourIndex: number,
): DateTime {
  return getReferenceDayStart(viewDate, referenceZone).plus({ hours: hourIndex })
}

export function addDaysToIsoDate(isoDate: string, days: number): string {
  return DateTime.fromISO(isoDate).plus({ days }).toFormat('yyyy-MM-dd')
}

export function buildDateStrip(centerDate: string, radius = 3): string[] {
  const center = DateTime.fromISO(centerDate)
  return Array.from({ length: radius * 2 + 1 }, (_, index) =>
    center.plus({ days: index - radius }).toFormat('yyyy-MM-dd'),
  )
}
