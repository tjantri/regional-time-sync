import {
  type CustomSlotId,
  getTimezoneOption,
  formatZoneLabel,
} from '../constants/customTimezones'
import type { RegionTimezone } from '../types/timezone'

export function buildCustomRegion(slotId: CustomSlotId, zone: string): RegionTimezone {
  const option = getTimezoneOption(zone)

  return {
    id: slotId,
    label: option?.label ?? formatZoneLabel(zone),
    zone,
    flag: '🌐',
    isCustom: true,
  }
}

export function getCustomSlotLabel(slotId: CustomSlotId): string {
  return slotId === 'custom-1' ? 'Custom 1' : 'Custom 2'
}
