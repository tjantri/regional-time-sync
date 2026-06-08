import { REGIONS } from './timezones'

export const CUSTOM_SLOT_IDS = ['custom-1', 'custom-2'] as const
export type CustomSlotId = (typeof CUSTOM_SLOT_IDS)[number]

export interface TimezoneOption {
  label: string
  zone: string
}

const ADDITIONAL_TIMEZONES: TimezoneOption[] = [
  { label: 'London', zone: 'Europe/London' },
  { label: 'Paris', zone: 'Europe/Paris' },
  { label: 'Berlin', zone: 'Europe/Berlin' },
  { label: 'Dubai', zone: 'Asia/Dubai' },
  { label: 'India', zone: 'Asia/Kolkata' },
  { label: 'Tokyo', zone: 'Asia/Tokyo' },
  { label: 'Los Angeles', zone: 'America/Los_Angeles' },
  { label: 'Chicago', zone: 'America/Chicago' },
  { label: 'Denver', zone: 'America/Denver' },
  { label: 'Toronto', zone: 'America/Toronto' },
  { label: 'São Paulo', zone: 'America/Sao_Paulo' },
  { label: 'Auckland', zone: 'Pacific/Auckland' },
  { label: 'Honolulu', zone: 'Pacific/Honolulu' },
]

function dedupeOptions(options: TimezoneOption[]): TimezoneOption[] {
  const seen = new Set<string>()
  return options.filter((option) => {
    if (seen.has(option.zone)) return false
    seen.add(option.zone)
    return true
  })
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = dedupeOptions([
  ...REGIONS.map((region) => ({ label: region.label, zone: region.zone })),
  ...ADDITIONAL_TIMEZONES,
]).sort((a, b) => a.label.localeCompare(b.label))

export const DEFAULT_CUSTOM_ZONES: Record<CustomSlotId, string> = {
  'custom-1': 'Europe/London',
  'custom-2': 'America/Los_Angeles',
}

export function isCustomSlotId(id: string): id is CustomSlotId {
  return CUSTOM_SLOT_IDS.includes(id as CustomSlotId)
}

export function getTimezoneOption(zone: string): TimezoneOption | undefined {
  return TIMEZONE_OPTIONS.find((option) => option.zone === zone)
}

export function formatZoneLabel(zone: string): string {
  const city = zone.split('/').pop()
  return city?.replace(/_/g, ' ') ?? zone
}
