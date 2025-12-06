type VisitCount = {
  date: Date
  count: number
}

export type DailyActiveUsersDto = {
  web: VisitCount[]
  mobile: VisitCount[]
}
