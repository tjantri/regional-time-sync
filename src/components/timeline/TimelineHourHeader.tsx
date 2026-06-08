import { DateTime } from 'luxon'
import { TIMELINE_HOURS } from '../../utils/timeline'

interface TimelineHourHeaderProps {
  viewDate: string
  referenceZone: string
  selectedColumnIndex: number | null
}

export function TimelineHourHeader({
  viewDate,
  referenceZone,
  selectedColumnIndex,
}: TimelineHourHeaderProps) {
  const dayStart = DateTime.fromISO(viewDate, { zone: referenceZone }).startOf('day')

  return (
    <div className="flex min-h-[2rem] border-b border-zinc-800/80 bg-zinc-900/80">
      <div className="w-8 shrink-0 border-r border-zinc-800/80" />
      <div className="w-52 shrink-0 border-r border-zinc-800/80 sm:w-60" />
      <div className="w-28 shrink-0 border-r border-zinc-800/80 sm:w-32" />
      <div className="flex min-w-0 flex-1 overflow-x-auto">
        <div className="flex min-w-full">
          {Array.from({ length: TIMELINE_HOURS }, (_, index) => {
            const hour = dayStart.plus({ hours: index })
            const isSelected = selectedColumnIndex === index

            return (
              <div
                key={index}
                className={`relative min-w-[2.25rem] flex-1 border-r py-1 text-center text-[9px] font-medium last:border-r-0 ${
                  isSelected
                    ? 'border-violet-500/40 bg-violet-500/20 font-semibold text-violet-300'
                    : 'border-zinc-800/50 text-zinc-600'
                }`}
              >
                {index % 3 === 0 ? hour.toFormat('ha').toLowerCase() : ''}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
