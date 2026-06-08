import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { DateTime } from 'luxon'
import type { TimezoneOption } from '../../constants/customTimezones'
import type { RegionTimezone } from '../../types/timezone'
import { TimelineRow } from './TimelineRow'

interface SortableTimelineRowProps {
  id: string
  region: RegionTimezone
  now: DateTime
  viewDate: string
  selectedInstant: DateTime | null
  selectedColumnIndex: number | null
  onSelectInstant: (instant: DateTime) => void
  isReference?: boolean
  zoneOptions?: TimezoneOption[]
  onZoneChange?: (zone: string) => void
}

export function SortableTimelineRow(props: SortableTimelineRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : undefined,
  }

  const dragHandle = (
    <button
      type="button"
      className="flex size-7 cursor-grab items-center justify-center rounded text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-400 active:cursor-grabbing"
      aria-label={`Drag to reorder ${props.region.label}`}
      {...attributes}
      {...listeners}
    >
      <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden="true">
        <circle cx="2" cy="2" r="1.2" />
        <circle cx="8" cy="2" r="1.2" />
        <circle cx="2" cy="7" r="1.2" />
        <circle cx="8" cy="7" r="1.2" />
        <circle cx="2" cy="12" r="1.2" />
        <circle cx="8" cy="12" r="1.2" />
      </svg>
    </button>
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-90 shadow-xl ring-1 ring-violet-500/40' : undefined}
    >
      <TimelineRow {...props} dragHandle={dragHandle} />
    </div>
  )
}
