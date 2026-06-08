import type { SelectionCellInfo } from '../../utils/timeline'
import { getSelectionCellClass } from './hourStyles'

interface SelectionColumnCellProps {
  info: SelectionCellInfo
  onSelect: () => void
}

export function SelectionColumnCell({ info, onSelect }: SelectionColumnCellProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      title={info.fullLabel}
      className={`relative flex h-full min-w-[2.25rem] flex-1 flex-col items-center justify-center border-r border-violet-500/30 transition-colors last:border-r-0 ${getSelectionCellClass(info.dayOffset)}`}
      aria-label={info.fullLabel}
      aria-pressed
    >
      {info.dayOffset !== 0 && (
        <span
          className={`absolute top-0.5 rounded px-1 text-[8px] font-bold uppercase leading-none ${
            info.dayOffset > 0
              ? 'bg-rose-500/40 text-rose-200'
              : 'bg-sky-500/40 text-sky-200'
          }`}
        >
          {info.dayOffset > 0 ? `+${info.dayOffset}` : info.dayOffset}
        </span>
      )}
      <span className="font-mono text-[11px] font-semibold leading-tight text-violet-100 tabular-nums">
        {info.timeLabel}
      </span>
    </button>
  )
}
