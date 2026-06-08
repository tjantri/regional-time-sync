import { DateTime } from 'luxon'
import { REFERENCE_ZONE } from '../../constants/timezones'
import { addDaysToIsoDate, buildDateStrip } from '../../utils/timeline'
import { snapTimeToQuarterHour } from '../../utils/timezone'
import { QuarterHourTimePicker } from '../QuarterHourTimePicker'

interface TimelineDateBarProps {
  viewDate: string
  onViewDateChange: (date: string) => void
  selectedInstant: DateTime | null
  onReferenceTimeChange: (date: string, time: string) => void
}

export function TimelineDateBar({
  viewDate,
  onViewDateChange,
  selectedInstant,
  onReferenceTimeChange,
}: TimelineDateBarProps) {
  const dates = buildDateStrip(viewDate, 4)
  const referenceTime = selectedInstant
    ? selectedInstant.setZone(REFERENCE_ZONE)
    : null

  const timeValue = referenceTime
    ? snapTimeToQuarterHour(referenceTime.toFormat('HH:mm'))
    : '09:00'

  return (
    <div className="flex flex-col gap-4 border-b border-zinc-800/80 bg-zinc-900/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onViewDateChange(addDaysToIsoDate(viewDate, -1))}
          className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          aria-label="Previous day"
        >
          ‹
        </button>

        <div className="flex flex-wrap gap-1">
          {dates.map((date) => {
            const dt = DateTime.fromISO(date)
            const isActive = date === viewDate
            const isToday = dt.hasSame(DateTime.now(), 'day')

            return (
              <button
                key={date}
                type="button"
                onClick={() => onViewDateChange(date)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-violet-500/25 text-violet-200 ring-1 ring-violet-500/50'
                    : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
              >
                {isToday && (
                  <span className="mb-0.5 block text-[9px] font-bold uppercase text-rose-400">
                    Today
                  </span>
                )}
                {dt.toFormat('MMM d')}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onViewDateChange(addDaysToIsoDate(viewDate, 1))}
          className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          aria-label="Next day"
        >
          ›
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Thailand reference
          </span>
          <input
            type="date"
            value={referenceTime?.toFormat('yyyy-MM-dd') ?? viewDate}
            onChange={(event) => onReferenceTimeChange(event.target.value, timeValue)}
            className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 font-mono text-xs text-zinc-100 outline-none focus:border-violet-500"
          />
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Meeting time
          </span>
          <QuarterHourTimePicker
            value={timeValue}
            onChange={(time) =>
              onReferenceTimeChange(referenceTime?.toFormat('yyyy-MM-dd') ?? viewDate, time)
            }
          />
        </div>
      </div>
    </div>
  )
}
