import type { WorkingHoursStatus } from '../../types/timezone'

export const HOUR_STATUS_CLASS: Record<WorkingHoursStatus, string> = {
  working: 'bg-emerald-500/25 hover:bg-emerald-500/35 border-emerald-500/30',
  transition: 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30',
  sleeping: 'bg-zinc-800/70 hover:bg-zinc-700/70 border-zinc-700/50',
}

export const HOUR_CURRENT_CLASS = 'ring-1 ring-sky-400/60'

export const SELECTION_COLUMN_CLASS =
  'bg-violet-500/35 ring-2 ring-violet-400/80 ring-inset z-10'

export const SELECTION_NEXT_DAY_CLASS =
  'bg-rose-500/30 ring-2 ring-rose-400/80 ring-inset z-10'

export const SELECTION_PREV_DAY_CLASS =
  'bg-sky-500/25 ring-2 ring-sky-400/70 ring-inset z-10'

export function getSelectionCellClass(dayOffset: number): string {
  if (dayOffset === 1) return SELECTION_NEXT_DAY_CLASS
  if (dayOffset === -1) return SELECTION_PREV_DAY_CLASS
  return SELECTION_COLUMN_CLASS
}
