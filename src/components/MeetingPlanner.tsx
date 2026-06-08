import { useMemo, useState } from 'react'
import type { DateTime } from 'luxon'
import { REFERENCE_ZONE } from '../constants/timezones'
import type { RegionTimezone } from '../types/timezone'
import {
  convertFromReference,
  getDefaultMeetingDateTime,
  parseReferenceDateTime,
  snapTimeToQuarterHour,
} from '../utils/timezone'
import { QuarterHourTimePicker } from './QuarterHourTimePicker'
import { TimezoneCard } from './TimezoneCard'

interface MeetingPlannerProps {
  now: DateTime
  orderedRegions: RegionTimezone[]
}

export function MeetingPlanner({ now, orderedRegions }: MeetingPlannerProps) {
  const defaults = useMemo(() => getDefaultMeetingDateTime(now), [now])
  const [date, setDate] = useState(defaults.date)
  const [time, setTime] = useState(defaults.time)

  const referenceDt = useMemo(() => parseReferenceDateTime(date, time), [date, time])
  const isValid = referenceDt.isValid

  const handleTimeChange = (nextTime: string) => {
    setTime(snapTimeToQuarterHour(nextTime))
  }

  return (
    <section
      aria-label="Meeting planner"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-100">Meeting Planner</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Select a time in Thailand — all regions convert instantly (15-minute intervals)
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 sm:flex-row sm:items-end">
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label="Thailand">
            🇹🇭
          </span>
          <div>
            <p className="text-sm font-medium text-zinc-200">Thailand (Reference)</p>
            <p className="font-mono text-xs text-zinc-500">{REFERENCE_ZONE}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 font-mono text-sm text-zinc-100 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
            />
          </label>
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Time
            </span>
            <QuarterHourTimePicker value={time} onChange={handleTimeChange} />
          </div>
        </div>
      </div>

      {!isValid && (
        <p className="mb-4 text-sm text-rose-400" role="alert">
          Please enter a valid date and time.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {orderedRegions.map((region) => {
          const display = isValid
            ? convertFromReference(referenceDt, region.zone)
            : {
                time: '--:--:--',
                date: '---',
                abbreviation: '---',
                offset: '+00:00',
                status: 'sleeping' as const,
              }

          return (
            <TimezoneCard
              key={region.id}
              region={region}
              display={display}
              isReference={region.zone === REFERENCE_ZONE}
            />
          )
        })}
      </div>
    </section>
  )
}
