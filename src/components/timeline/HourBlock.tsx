import type { TimelineHourBlock } from '../../utils/timeline'
import { HOUR_CURRENT_CLASS, HOUR_STATUS_CLASS } from './hourStyles'

interface HourBlockProps {
  block: TimelineHourBlock
  onSelect: () => void
  isSelectionColumn?: boolean
}

export function HourBlock({ block, onSelect, isSelectionColumn = false }: HourBlockProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      title={block.label}
      className={`relative h-full min-w-[2.25rem] flex-1 border-r border-zinc-800/80 transition-colors last:border-r-0 ${HOUR_STATUS_CLASS[block.status]} ${block.isCurrent ? HOUR_CURRENT_CLASS : ''} ${isSelectionColumn ? 'border-violet-500/20' : ''}`}
      aria-label={block.label}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0.5 text-center text-[9px] font-medium text-zinc-500 tabular-nums">
        {block.index % 3 === 0 ? block.localHour : ''}
      </span>
    </button>
  )
}
