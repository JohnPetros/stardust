import type { WeekdayStatus } from '../types'

export class WeekStatus {
  static readonly DAYS: string[] = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

  private constructor(readonly statuses: WeekdayStatus[] = []) {}

  static create(values: string[]) {
    if (!WeekStatus.isStatus(values)) {
      throw new ValidationError(['Weekday Statuses are not valid'])
    }

    new NumberValidation(values.length, 'Weekday Statuses count')
      .equal(WeekStatus.DAYS.length)
      .validate()

    return new WeekStatus(values)
  }

  static isStatus(values: string[]): values is WeekdayStatus[] {
    for (const value of values) {
      new StringValidation(value, 'Weekday Status')
        .oneOf(['todo', 'undone', 'done'])
        .validate()
    }

    return true
  }

  updateTodayStatus(newStatus: WeekdayStatus): WeekStatus {
    const todayIndex = new Datetime().getTodayIndex()

    return new WeekStatus(
      this.statuses.map((status, index) => (index === todayIndex ? newStatus : status)),
    )
  }

  get todayStatus(): WeekdayStatus {
    const todayIndex = new Datetime().getTodayIndex()
    return this.statuses[todayIndex]
  }
}
