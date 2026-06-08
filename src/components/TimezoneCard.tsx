import type { TimezoneOption } from '../constants/customTimezones'
import type { RegionTimezone, TimezoneDisplay } from '../types/timezone'
import { TimezoneSelect } from './TimezoneSelect'
import { WorkingHoursIndicator } from './WorkingHoursIndicator'

interface DragHandleProps {
  role?: string
  tabIndex?: number
  'aria-describedby'?: string
  'aria-disabled'?: boolean
  'aria-pressed'?: boolean
  'aria-roledescription'?: string
  onKeyDown?: (event: React.KeyboardEvent) => void
  onPointerDown?: (event: React.PointerEvent) => void
}

interface TimezoneCardProps {
  region: RegionTimezone
  display: TimezoneDisplay
  isReference?: boolean
  isDragging?: boolean
  dragHandleProps?: DragHandleProps
  zoneOptions?: TimezoneOption[]
  onZoneChange?: (zone: string) => void
}

const STATUS_BORDER: Record<TimezoneDisplay['status'], string> = {
  working: 'border-emerald-500/40 shadow-emerald-500/5',
  transition: 'border-amber-500/40 shadow-amber-500/5',
  sleeping: 'border-rose-500/30 shadow-rose-500/5',
}

export function TimezoneCard({
  region,
  display,
  isReference = false,
  isDragging = false,
  dragHandleProps,
  zoneOptions,
  onZoneChange,
}: TimezoneCardProps) {
  const isCustom = region.isCustom === true

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-zinc-900/60 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/80 hover:shadow-xl ${STATUS_BORDER[display.status]} ${isReference ? 'ring-2 ring-violet-500/50' : ''} ${isCustom ? 'border-sky-500/30' : ''} ${isDragging ? 'scale-[1.02] shadow-2xl ring-2 ring-violet-400/40' : ''}`}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-violet-500/5 blur-2xl transition-opacity group-hover:opacity-100" />

      {dragHandleProps && (
        <button
          type="button"
          className="absolute left-3 top-3 flex size-7 cursor-grab items-center justify-center rounded-md border border-zinc-700/80 bg-zinc-800/80 text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300 active:cursor-grabbing"
          aria-label={`Drag to reorder ${region.label}`}
          {...dragHandleProps}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="4" cy="3" r="1.25" />
            <circle cx="10" cy="3" r="1.25" />
            <circle cx="4" cy="7" r="1.25" />
            <circle cx="10" cy="7" r="1.25" />
            <circle cx="4" cy="11" r="1.25" />
            <circle cx="10" cy="11" r="1.25" />
          </svg>
        </button>
      )}

      <header className={`mb-4 flex items-start justify-between gap-2 ${dragHandleProps ? 'pl-8' : ''}`}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" role="img" aria-label={region.label}>
              {region.flag}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-zinc-100">{region.label}</h3>
              {!isCustom && <p className="font-mono text-xs text-zinc-500">{region.zone}</p>}
            </div>
          </div>

          {isCustom && zoneOptions && onZoneChange && (
            <div className="mt-3">
              <TimezoneSelect
                id={`timezone-select-${region.id}`}
                value={region.zone}
                options={zoneOptions}
                onChange={onZoneChange}
              />
            </div>
          )}
        </div>
        <WorkingHoursIndicator status={display.status} compact />
      </header>

      <div className="space-y-1">
        <p className="font-mono text-3xl font-semibold tracking-tight text-zinc-50 tabular-nums">
          {display.time}
        </p>
        <p className="text-sm text-zinc-400">{display.date}</p>
      </div>

      <footer className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
        <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 font-mono text-xs font-medium text-violet-300">
          {display.abbreviation}
        </span>
        <span className="font-mono text-xs text-zinc-500">UTC{display.offset}</span>
      </footer>

      {isReference && (
        <span className="absolute right-3 top-3 rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
          Reference
        </span>
      )}

      {isCustom && !isReference && (
        <span className="absolute right-3 top-3 rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-300">
          Custom
        </span>
      )}
    </article>
  )
}
