import { QUARTER_HOUR_MINUTES } from '../utils/timezone'

interface QuarterHourTimePickerProps {
  value: string
  onChange: (value: string) => void
}

const HOURS = Array.from({ length: 24 }, (_, index) => index.toString().padStart(2, '0'))

const selectClassName =
  'rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 font-mono text-sm text-zinc-100 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50'

export function QuarterHourTimePicker({ value, onChange }: QuarterHourTimePickerProps) {
  const [hour = '09', minute = '00'] = value.split(':')

  const updateTime = (nextHour: string, nextMinute: string) => {
    onChange(`${nextHour}:${nextMinute}`)
  }

  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="Hour"
        value={hour}
        onChange={(event) => updateTime(event.target.value, minute)}
        className={selectClassName}
      >
        {HOURS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="font-mono text-lg text-zinc-400">:</span>
      <select
        aria-label="Minute"
        value={QUARTER_HOUR_MINUTES.includes(minute as (typeof QUARTER_HOUR_MINUTES)[number]) ? minute : '00'}
        onChange={(event) => updateTime(hour, event.target.value)}
        className={selectClassName}
      >
        {QUARTER_HOUR_MINUTES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
