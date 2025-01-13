export type DateFormat =
  | 'Y-m-d H:i:s'
  | 'DD MMMM [de] YYYY'
  | 'DD/MM/YYYY'
  | 'MMM D, YYYY'
  | 'MMM D, YYYY HH:mm:ss'
  | 'mm:ss'

export interface IDatetime {
  format(dateFormat: DateFormat): string
  getDaysCountToSunday(): number
  convertSecondsToTime(seconds: number): string
  getTodayIndex(): number
  date(): Date
}
