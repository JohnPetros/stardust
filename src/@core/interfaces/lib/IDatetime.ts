export type DateFormat = 'Y-m-d H:i:s' | 'DD MMMM [de] YYYY' | 'DD/MM/YYYY'

export interface IDatetime {
  format(date: Date, dateFormat: DateFormat): string
  getDaysCountToSunday(): number
}
