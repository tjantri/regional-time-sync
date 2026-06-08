import type { WorkingHoursStatus } from '../types/timezone'

interface WorkingHoursIndicatorProps {
  status: WorkingHoursStatus
  compact?: boolean
}

const STATUS_CONFIG: Record<
  WorkingHoursStatus,
  { label: string; dot: string; ring: string; bg: string }
> = {
  working: {
    label: 'Working hours',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
  transition: {
    label: 'Off-peak hours',
    dot: 'bg-amber-400',
    ring: 'ring-amber-500/30',
    bg: 'bg-amber-500/10',
  },
  sleeping: {
    label: 'Sleeping hours',
    dot: 'bg-rose-500',
    ring: 'ring-rose-500/30',
    bg: 'bg-rose-500/10',
  },
}

export function WorkingHoursIndicator({ status, compact = false }: WorkingHoursIndicatorProps) {
  const config = STATUS_CONFIG[status]

  if (compact) {
    return (
      <span
        className={`inline-block size-2.5 rounded-full ${config.dot} shadow-[0_0_8px_currentColor]`}
        title={config.label}
        aria-label={config.label}
      />
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${config.bg} ${config.ring} text-zinc-300`}
    >
      <span className={`size-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
