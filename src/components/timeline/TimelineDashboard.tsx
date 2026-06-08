import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { DateTime } from 'luxon'
import { TIMEZONE_OPTIONS } from '../../constants/customTimezones'
import type { CustomSlotId } from '../../constants/customTimezones'
import type { CustomZonesMap } from '../../hooks/useCustomTimezones'
import { useMeetingSelection } from '../../hooks/useMeetingSelection'
import { REFERENCE_ZONE } from '../../constants/timezones'
import { resolveAllRows } from '../../utils/dashboardCards'
import { getSelectionColumnIndex } from '../../utils/timeline'
import { TimelineDateBar } from './TimelineDateBar'
import { TimelineHourHeader } from './TimelineHourHeader'
import { SortableTimelineRow } from './SortableTimelineRow'

interface TimelineDashboardProps {
  now: DateTime
  order: string[]
  customZones: CustomZonesMap
  onCustomZoneChange: (slotId: CustomSlotId, zone: string) => void
  onOrderChange: (order: string[]) => void
}

export function TimelineDashboard({
  now,
  order,
  customZones,
  onCustomZoneChange,
  onOrderChange,
}: TimelineDashboardProps) {
  const rows = resolveAllRows(order, customZones)
  const { viewDate, setViewDate, selectedInstant, selectInstant, selectReferenceTime } =
    useMeetingSelection(now)

  const selectedColumnIndex = getSelectionColumnIndex(
    selectedInstant,
    viewDate,
    REFERENCE_ZONE,
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = order.indexOf(String(active.id))
    const newIndex = order.indexOf(String(over.id))
    if (oldIndex === -1 || newIndex === -1) return

    onOrderChange(arrayMove(order, oldIndex, newIndex))
  }

  return (
    <section
      aria-label="Timezone timeline"
      className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-xl backdrop-blur-sm"
    >
      <div className="border-b border-zinc-800/80 px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-zinc-100">World Clock & Meeting Planner</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Click any hour to sync all zones. Drag rows to reorder. Colors show working, off-peak,
          and sleeping hours.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-emerald-500/30 ring-1 ring-emerald-500/40" />
            9:00–18:00 Working
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-amber-500/20 ring-1 ring-amber-500/30" />
            7:00–9:00 & 18:00–21:00 Off-peak
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-zinc-800 ring-1 ring-zinc-700" />
            Sleeping
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-violet-500/40 ring-2 ring-violet-400/70" />
            Selected column (Thailand time)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-rose-500/30 ring-2 ring-rose-400/80" />
            +1 day in zone
          </span>
        </div>
      </div>

      <TimelineDateBar
        viewDate={viewDate}
        onViewDateChange={setViewDate}
        selectedInstant={selectedInstant}
        onReferenceTimeChange={selectReferenceTime}
      />

      <div className="overflow-x-auto">
        <TimelineHourHeader
          viewDate={viewDate}
          referenceZone={REFERENCE_ZONE}
          selectedColumnIndex={selectedColumnIndex}
        />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            {rows.map((row) => (
              <SortableTimelineRow
                key={row.id}
                id={row.id}
                region={row.region}
                now={now}
                viewDate={viewDate}
                selectedInstant={selectedInstant}
                selectedColumnIndex={selectedColumnIndex}
                onSelectInstant={selectInstant}
                isReference={row.region.zone === REFERENCE_ZONE && !row.isCustom}
                zoneOptions={row.isCustom ? TIMEZONE_OPTIONS : undefined}
                onZoneChange={
                  row.isCustom && row.slotId
                    ? (zone) => onCustomZoneChange(row.slotId!, zone)
                    : undefined
                }
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </section>
  )
}
