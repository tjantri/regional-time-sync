import type { DateTime } from 'luxon'
import { useBrowserTimezone } from '../hooks/useBrowserTimezone'

interface HeaderProps {
  now: DateTime
}

export function Header({ now }: HeaderProps) {
  const browserTimezone = useBrowserTimezone()
  const localTime = now.setZone(browserTimezone)

  return (
    <header className="relative overflow-hidden border-b border-zinc-800/80 bg-zinc-900/50 px-6 py-8 backdrop-blur-md sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-violet-500/20 text-lg">
              🌏
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Timezone Dashboard
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            Regional Time Sync
          </h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-500">
            Coordinate across Southeast Asia, South Korea, Australia, and New York with live
            clocks and instant meeting conversions.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-4 text-right">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Your Local Time
          </p>
          <p className="font-mono text-2xl font-semibold text-zinc-100 tabular-nums">
            {localTime.toFormat('HH:mm:ss')}
          </p>
          <p className="text-xs text-zinc-500">
            {localTime.toFormat('EEE, MMM d')} ·{' '}
            {localTime.offsetNameShort ?? localTime.toFormat('ZZZZ')}
          </p>
          <p className="mt-1 font-mono text-[10px] text-zinc-600">
            {browserTimezone} · UTC{localTime.toFormat('ZZ')}
          </p>
        </div>
      </div>
    </header>
  )
}
