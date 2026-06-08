import { useCallback, useState } from 'react'
import {
  CUSTOM_SLOT_IDS,
  DEFAULT_CUSTOM_ZONES,
  isCustomSlotId,
  type CustomSlotId,
} from '../constants/customTimezones'

const STORAGE_KEY = 'time-sync-custom-zones'

export type CustomZonesMap = Record<CustomSlotId, string>

function loadCustomZones(): CustomZonesMap {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { ...DEFAULT_CUSTOM_ZONES }

    const parsed = JSON.parse(saved) as unknown
    if (typeof parsed !== 'object' || parsed === null) return { ...DEFAULT_CUSTOM_ZONES }

    const loaded = { ...DEFAULT_CUSTOM_ZONES }
    for (const slotId of CUSTOM_SLOT_IDS) {
      const zone = (parsed as Record<string, unknown>)[slotId]
      if (typeof zone === 'string' && zone.length > 0) {
        loaded[slotId] = zone
      }
    }

    return loaded
  } catch {
    return { ...DEFAULT_CUSTOM_ZONES }
  }
}

export function useCustomTimezones() {
  const [customZones, setCustomZonesState] = useState<CustomZonesMap>(loadCustomZones)

  const setCustomZone = useCallback((slotId: CustomSlotId, zone: string) => {
    setCustomZonesState((current) => {
      const next = { ...current, [slotId]: zone }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { customZones, setCustomZone, isCustomSlotId }
}
