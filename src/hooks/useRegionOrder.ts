import { useCallback, useState } from 'react'
import { CUSTOM_SLOT_IDS } from '../constants/customTimezones'
import { REGIONS } from '../constants/timezones'

const STORAGE_KEY = 'regional-time-sync-card-order'

export const FIXED_REGION_IDS = REGIONS.map((region) => region.id)
const DEFAULT_ORDER = [...FIXED_REGION_IDS]

function loadSavedOrder(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_ORDER

    const parsed = JSON.parse(saved) as unknown
    if (!Array.isArray(parsed)) return DEFAULT_ORDER

    const validIds = new Set(FIXED_REGION_IDS)
    const restored = parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id))
    const missing = FIXED_REGION_IDS.filter((id) => !restored.includes(id))

    return [...restored, ...missing]
  } catch {
    return DEFAULT_ORDER
  }
}

export function useRegionOrder() {
  const [order, setOrderState] = useState<string[]>(loadSavedOrder)

  const setOrder = useCallback((nextOrder: string[]) => {
    const regionalOnly = nextOrder.filter((id) => FIXED_REGION_IDS.includes(id))
    setOrderState(regionalOnly)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(regionalOnly))
  }, [])

  return { order, setOrder }
}

export { CUSTOM_SLOT_IDS }
