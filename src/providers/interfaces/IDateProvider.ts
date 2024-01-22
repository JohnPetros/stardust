type DateFormat = 'Y-m-d H:i:s' | 'DD MMMM [de] YYYY' | 'DD/MM/YYYY'

export interface IDateProvider {
  format(date: Date, dateFormat: DateFormat): string
  getTodayIndex(): number
}
