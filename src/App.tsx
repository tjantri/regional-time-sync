import { Header } from './components/Header'
import { TimelineDashboard } from './components/timeline/TimelineDashboard'
import { useCurrentTime } from './hooks/useCurrentTime'
import { useCustomTimezones } from './hooks/useCustomTimezones'
import { useRegionOrder } from './hooks/useRegionOrder'

function App() {
  const now = useCurrentTime()
  const { order, setOrder } = useRegionOrder()
  const { customZones, setCustomZone } = useCustomTimezones()

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent" />

      <Header now={now} />

      <main className="relative mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <TimelineDashboard
          now={now}
          order={order}
          customZones={customZones}
          onCustomZoneChange={setCustomZone}
          onOrderChange={setOrder}
        />
      </main>

      <footer className="relative border-t border-zinc-800/80 px-6 py-6 text-center text-xs text-zinc-600">
        Time Sync · Powered by Luxon · DST handled automatically
      </footer>
    </div>
  )
}

export default App
