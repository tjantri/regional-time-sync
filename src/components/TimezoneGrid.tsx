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
import type { RegionTimezone } from '../types/timezone'
import { getNowInZone } from '../utils/timezone'
import { SortableTimezoneCard } from './SortableTimezoneCard'

interface TimezoneGridProps {
  now: DateTime
  order: string[]
  orderedRegions: RegionTimezone[]
  onOrderChange: (order: string[]) => void
}

export function TimezoneGrid({ now, order, orderedRegions, onOrderChange }: TimezoneGridProps) {
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
            reorder.
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
        <SortableContext items={order} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {orderedRegions.map((region) => (
              <SortableTimezoneCard
                key={region.id}
                id={region.id}
                region={region}
                display={getNowInZone(region.zone, now)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  )
}
