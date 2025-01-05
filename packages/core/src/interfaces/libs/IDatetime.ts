export type DateFormat =
  | 'Y-m-d H:i:s'
  | 'DD MMMM [de] YYYY'
  | 'DD/MM/YYYY'
  | 'MMM D, YYYY'
  | 'mm:ss'

export interface IDatetime {
  format(date: Date, dateFormat: DateFormat): string
  getDaysCountToSunday(): number
  convertSecondsToTime(seconds: number): string
  getTodayIndex(): number
}
