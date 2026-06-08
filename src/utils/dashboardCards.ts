import { REGIONS, REFERENCE_ZONE } from '../constants/timezones'
import {
  CUSTOM_SLOT_IDS,
  TIMEZONE_OPTIONS,
  type CustomSlotId,
} from '../constants/customTimezones'
import type { CustomZonesMap } from '../hooks/useCustomTimezones'
import type { RegionTimezone } from '../types/timezone'
import { buildCustomRegion } from './region'

export interface ResolvedDashboardCard {
  id: string
  region: RegionTimezone
  isCustom: boolean
  slotId?: CustomSlotId
}

export function resolveAllRows(order: string[], customZones: CustomZonesMap): ResolvedDashboardCard[] {
  const regionMap = new Map(REGIONS.map((region) => [region.id, region]))
  const cards: ResolvedDashboardCard[] = []

  for (const id of order) {
    const fixedRegion = regionMap.get(id)
    if (fixedRegion) {
      cards.push({ id, region: fixedRegion, isCustom: false })
      continue
    }

    if (CUSTOM_SLOT_IDS.includes(id as CustomSlotId)) {
      const slotId = id as CustomSlotId
      cards.push({
        id,
        region: buildCustomRegion(slotId, customZones[slotId]),
        isCustom: true,
        slotId,
      })
    }
  }

  return cards
}

export { REFERENCE_ZONE, TIMEZONE_OPTIONS }
