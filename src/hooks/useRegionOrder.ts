import { useCallback, useState } from 'react'
import { REGIONS } from '../constants/timezones'
import type { RegionTimezone } from '../types/timezone'

const STORAGE_KEY = 'regional-time-sync-card-order'
const DEFAULT_ORDER = REGIONS.map((region) => region.id)

function loadSavedOrder(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_ORDER

    const parsed = JSON.parse(saved) as unknown
    if (!Array.isArray(parsed)) return DEFAULT_ORDER

    const validIds = new Set(REGIONS.map((region) => region.id))
    const restored = parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id))
    const missing = REGIONS.filter((region) => !restored.includes(region.id)).map((region) => region.id)

    return [...restored, ...missing]
  } catch {
    return DEFAULT_ORDER
  }
}

function toOrderedRegions(order: string[]): RegionTimezone[] {
  const regionMap = new Map(REGIONS.map((region) => [region.id, region]))
  return order.flatMap((id) => {
    const region = regionMap.get(id)
    return region ? [region] : []
  })
}

export function useRegionOrder() {
  const [order, setOrderState] = useState<string[]>(loadSavedOrder)
  const orderedRegions = toOrderedRegions(order)

  const setOrder = useCallback((nextOrder: string[]) => {
    setOrderState(nextOrder)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrder))
  }, [])

  return { order, setOrder, orderedRegions }
}
