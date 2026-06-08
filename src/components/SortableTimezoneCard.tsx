import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TimezoneOption } from '../constants/customTimezones'
import type { RegionTimezone, TimezoneDisplay } from '../types/timezone'
import { TimezoneCard } from './TimezoneCard'

interface SortableTimezoneCardProps {
  id: string
  region: RegionTimezone
  display: TimezoneDisplay
  isReference?: boolean
  zoneOptions?: TimezoneOption[]
  onZoneChange?: (zone: string) => void
}

export function SortableTimezoneCard({
  id,
  region,
  display,
  isReference = false,
  zoneOptions,
  onZoneChange,
}: SortableTimezoneCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'touch-none' : undefined}>
      <TimezoneCard
        region={region}
        display={display}
        isReference={isReference}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
        zoneOptions={zoneOptions}
        onZoneChange={onZoneChange}
      />
    </div>
  )
}
