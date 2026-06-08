import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import type { DateTime } from 'luxon'
import { TIMEZONE_OPTIONS } from '../constants/customTimezones'
import type { CustomSlotId } from '../constants/customTimezones'
import type { CustomZonesMap } from '../hooks/useCustomTimezones'
import { REFERENCE_ZONE } from '../constants/timezones'
import { getNowInZone } from '../utils/timezone'
import { resolveCustomCards, resolveRegionalCards } from '../utils/dashboardCards'
import { DASHBOARD_GRID_CLASS } from './DashboardCardsLayout'
import { SortableTimezoneCard } from './SortableTimezoneCard'
import { TimezoneCard } from './TimezoneCard'

interface TimezoneGridProps {
  now: DateTime
  order: string[]
  customZones: CustomZonesMap
  onCustomZoneChange: (slotId: CustomSlotId, zone: string) => void
  onOrderChange: (order: string[]) => void
}

export function TimezoneGrid({
  now,
  order,
  customZones,
  onCustomZoneChange,
  onOrderChange,
}: TimezoneGridProps) {
  const regionalCards = resolveRegionalCards(order)
  const customCards = resolveCustomCards(customZones)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
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
    <section aria-label="Regional timezones">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Live Regional Clocks</h2>
          <p className="text-sm text-zinc-500">
            Updates every second with automatic daylight saving adjustments. Drag cards to
            reorder. Custom cards on the third row let you pick any timezone.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400" />
            9:00–18:00 Working
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-400" />
            7:00–9:00 & 18:00–21:00 Off-peak
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-500" />
            Sleeping
          </span>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className={DASHBOARD_GRID_CLASS}>
          <SortableContext items={order} strategy={rectSortingStrategy}>
            {regionalCards.map((card) => (
              <SortableTimezoneCard
                key={card.id}
                id={card.id}
                region={card.region}
                display={getNowInZone(card.region.zone, now)}
                isReference={card.region.zone === REFERENCE_ZONE}
              />
            ))}
          </SortableContext>
          {customCards.map((card) => (
            <TimezoneCard
              key={card.id}
              region={card.region}
              display={getNowInZone(card.region.zone, now)}
              zoneOptions={TIMEZONE_OPTIONS}
              onZoneChange={(zone) => onCustomZoneChange(card.slotId!, zone)}
            />
          ))}
        </div>
      </DndContext>
    </section>
  )
}
