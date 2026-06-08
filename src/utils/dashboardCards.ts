import { REGIONS, REFERENCE_ZONE } from '../constants/timezones'
import {
  CUSTOM_SLOT_IDS,
  TIMEZONE_OPTIONS,
  type CustomSlotId,
} from '../constants/customTimezones'
import type { CustomZonesMap } from '../hooks/useCustomTimezones'
import type { RegionTimezone } from '../types/timezone'
import { buildCustomRegion } from '../utils/region'

export interface ResolvedDashboardCard {
  id: string
  region: RegionTimezone
  isCustom: boolean
  slotId?: CustomSlotId
}

export function resolveRegionalCards(order: string[]): ResolvedDashboardCard[] {
  const regionMap = new Map(REGIONS.map((region) => [region.id, region]))

  return order.flatMap((id) => {
    const region = regionMap.get(id)
    return region ? [{ id, region, isCustom: false as const }] : []
  })
}

export function resolveCustomCards(customZones: CustomZonesMap): ResolvedDashboardCard[] {
  return CUSTOM_SLOT_IDS.map((slotId) => ({
    id: slotId,
    region: buildCustomRegion(slotId, customZones[slotId]),
    isCustom: true as const,
    slotId,
  }))
}

export { REFERENCE_ZONE, TIMEZONE_OPTIONS }
