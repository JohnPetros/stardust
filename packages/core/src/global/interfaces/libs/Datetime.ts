export type DateFormat =
  | 'Y-m-d H:i:s'
  | 'YYYY/MM/DD HH:mm:ss'
  | 'DD MMMM [de] YYYY'
  | 'DD/MM/YYYY'
  | 'DD/MM/YYYY HH:mm:ss'
  | 'MMM D, YYYY'
  | 'MMM D, YYYY HH:mm:ss'
  | 'mm:ss'

export interface Datetime {
  format(dateFormat: DateFormat): string
  formatTimeAgo(): string
  getDaysCountToSunday(): number
  getEndOfDay(): Date
  convertSecondsToTime(seconds: number): string
  getTodayIndex(): number
  getYesterdayWeekdayIndex(): number
  getRelativeTime(): string
  date(): Date
  minusMonths(months: number): Date
}
