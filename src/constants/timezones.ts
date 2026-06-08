import type { RegionTimezone } from '../types/timezone'

export const REFERENCE_ZONE = 'Asia/Bangkok'

export const REGIONS: readonly RegionTimezone[] = [
  { id: 'thailand', label: 'Thailand', zone: 'Asia/Bangkok', flag: '🇹🇭' },
  { id: 'indonesia', label: 'Indonesia', zone: 'Asia/Jakarta', flag: '🇮🇩' },
  { id: 'philippines', label: 'Philippines', zone: 'Asia/Manila', flag: '🇵🇭' },
  { id: 'malaysia', label: 'Malaysia', zone: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
  { id: 'singapore', label: 'Singapore', zone: 'Asia/Singapore', flag: '🇸🇬' },
  { id: 'vietnam', label: 'Vietnam', zone: 'Asia/Ho_Chi_Minh', flag: '🇻🇳' },
  { id: 'taiwan', label: 'Taiwan', zone: 'Asia/Taipei', flag: '🇹🇼' },
  { id: 'korea', label: 'South Korea', zone: 'Asia/Seoul', flag: '🇰🇷' },
  { id: 'australia', label: 'Australia', zone: 'Australia/Sydney', flag: '🇦🇺' },
  { id: 'new-york', label: 'New York', zone: 'America/New_York', flag: '🇺🇸' },
] as const
