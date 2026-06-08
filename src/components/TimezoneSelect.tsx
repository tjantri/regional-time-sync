import type { TimezoneOption } from '../constants/customTimezones'

interface TimezoneSelectProps {
  value: string
  options: TimezoneOption[]
  onChange: (zone: string) => void
  id: string
}

const selectClassName =
  'w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 font-mono text-xs text-zinc-100 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50'

export function TimezoneSelect({ value, options, onChange, id }: TimezoneSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={selectClassName}
      aria-label="Select timezone"
    >
      {options.map((option) => (
        <option key={option.zone} value={option.zone}>
          {option.label} ({option.zone})
        </option>
      ))}
    </select>
  )
}
