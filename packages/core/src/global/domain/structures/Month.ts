import { Datetime } from '#global/libs/index'

export class Month {
  private constructor(readonly value: Date) {}

  static create() {
    const currentDate = new Date()
    return new Month(currentDate)
  }

  get firstDay(): Date {
    const datetime = new Datetime(this.value)
    return datetime.firstDayOfMonth()
  }

  get lastDay(): Date {
    const datetime = new Datetime(this.value)
    return datetime.lastDayOfMonth()
  }

  get previousMonth(): Month {
    const datetime = new Datetime(this.value)
    return new Month(datetime.minusMonths(1))
  }
}
