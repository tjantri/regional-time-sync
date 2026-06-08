import type { ReactNode } from 'react'
import type { DateTime } from 'luxon'
import { REFERENCE_ZONE } from '../../constants/timezones'
import type { TimezoneOption } from '../../constants/customTimezones'
import type { RegionTimezone } from '../../types/timezone'
import { formatTimezoneDisplay } from '../../utils/timezone'
import {
  buildTimelineHours,
  formatOffsetLabel,
  getOffsetHoursFromReference,
  getSelectionCellInfo,
  instantFromReferenceHour,
} from '../../utils/timeline'
import { TimezoneSelect } from '../TimezoneSelect'
import { HourBlock } from './HourBlock'
import { SelectionColumnCell } from './SelectionColumnCell'

interface TimelineRowProps {
  region: RegionTimezone
  now: DateTime
  viewDate: string
  selectedInstant: DateTime | null
  selectedColumnIndex: number | null
  onSelectInstant: (instant: DateTime) => void
  isReference?: boolean
  zoneOptions?: TimezoneOption[]
  onZoneChange?: (zone: string) => void
  dragHandle?: ReactNode
}

export function TimelineRow({
  region,
  now,
  viewDate,
  selectedInstant,
  selectedColumnIndex,
  onSelectInstant,
  isReference = false,
  zoneOptions,
  onZoneChange,
  dragHandle,
}: TimelineRowProps) {
  const localNow = now.setZone(region.zone)
  const display = formatTimezoneDisplay(localNow)
  const offsetHours = getOffsetHoursFromReference(region.zone, REFERENCE_ZONE, now)
  const hours = buildTimelineHours(region.zone, viewDate, REFERENCE_ZONE, now)

  const selectionInfo =
    selectedInstant && selectedColumnIndex !== null
      ? getSelectionCellInfo(selectedInstant, region.zone, REFERENCE_ZONE)
      : null

  return (
    <div
      className={`group flex min-h-[4.5rem] border-b border-zinc-800/80 bg-zinc-900/40 transition-colors hover:bg-zinc-900/60 ${isReference ? 'bg-violet-500/5' : ''}`}
    >
      <div className="flex w-8 shrink-0 items-center justify-center border-r border-zinc-800/80">
        {dragHandle}
      </div>

      <div className="flex w-52 shrink-0 flex-col justify-center border-r border-zinc-800/80 px-3 py-2 sm:w-60">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 w-8 shrink-0 text-center text-xs font-semibold text-violet-300 tabular-nums">
            {formatOffsetLabel(offsetHours)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">{region.flag}</span>
              <p className="truncate text-sm font-semibold text-zinc-100">{region.label}</p>
              {isReference && (
                <span className="rounded bg-violet-500/20 px-1 py-0.5 text-[9px] font-semibold uppercase text-violet-300">
                  Ref
                </span>
              )}
              {region.isCustom && (
                <span className="rounded bg-sky-500/20 px-1 py-0.5 text-[9px] font-semibold uppercase text-sky-300">
                  Custom
                </span>
              )}
            </div>
            <p className="truncate font-mono text-[10px] text-zinc-500">
              {display.abbreviation} · {region.zone}
            </p>
            {region.isCustom && zoneOptions && onZoneChange && (
              <div className="mt-1.5">
                <TimezoneSelect
                  id={`row-select-${region.id}`}
                  value={region.zone}
                  options={zoneOptions}
                  onChange={onZoneChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-28 shrink-0 flex-col justify-center border-r border-zinc-800/80 px-3 py-2 sm:w-32">
        <p className="font-mono text-lg font-semibold leading-tight text-zinc-50 tabular-nums">
          {localNow.toFormat('h:mm')}
          <span className="text-xs font-normal text-zinc-500">{localNow.toFormat('a').toLowerCase()}</span>
        </p>
        <p className="text-[11px] text-zinc-500">{localNow.toFormat('ccc, MMM d')}</p>
      </div>

      <div className="flex min-w-0 flex-1 overflow-x-auto">
        <div className="flex h-full min-w-full">
          {hours.map((block) => {
            if (selectedColumnIndex === block.index && selectionInfo && selectedInstant) {
              return (
                <SelectionColumnCell
                  key={block.index}
                  info={selectionInfo}
                  onSelect={() => onSelectInstant(selectedInstant)}
                />
              )
            }

            return (
              <HourBlock
                key={block.index}
                block={block}
                isSelectionColumn={selectedColumnIndex === block.index}
                onSelect={() =>
                  onSelectInstant(instantFromReferenceHour(viewDate, REFERENCE_ZONE, block.index))
                }
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
