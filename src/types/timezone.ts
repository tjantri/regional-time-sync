export type WorkingHoursStatus = 'working' | 'transition' | 'sleeping'

export interface RegionTimezone {
  id: string
  label: string
  zone: string
  flag: string
}

export interface TimezoneDisplay {
  time: string
  date: string
  abbreviation: string
  offset: string
  status: WorkingHoursStatus
}
