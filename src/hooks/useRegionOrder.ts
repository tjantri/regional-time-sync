import { useCallback, useState } from 'react'
import { CUSTOM_SLOT_IDS } from '../constants/customTimezones'
import { REGIONS } from '../constants/timezones'

const STORAGE_KEY = 'regional-time-sync-card-order'

export const FIXED_REGION_IDS = REGIONS.map((region) => region.id)
const ALL_ROW_IDS = [...FIXED_REGION_IDS, ...CUSTOM_SLOT_IDS]
const DEFAULT_ORDER = [...ALL_ROW_IDS]

function loadSavedOrder(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_ORDER

    const parsed = JSON.parse(saved) as unknown
    if (!Array.isArray(parsed)) return DEFAULT_ORDER

    const validIds = new Set(ALL_ROW_IDS)
    const restored = parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id))
    const missing = ALL_ROW_IDS.filter((id) => !restored.includes(id))

    return [...restored, ...missing]
  } catch {
    return DEFAULT_ORDER
  }
}

export function useRegionOrder() {
  const [order, setOrderState] = useState<string[]>(loadSavedOrder)

  const setOrder = useCallback((nextOrder: string[]) => {
    const valid = nextOrder.filter((id) => ALL_ROW_IDS.includes(id))
    setOrderState(valid)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(valid))
  }, [])

  return { order, setOrder }
}

export { CUSTOM_SLOT_IDS, ALL_ROW_IDS }
