import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

import type { DateFormat, Datetime } from '#global/interfaces/libs/Datetime'

dayjs.locale('pt-br')
dayjs.extend(relativeTime)

export class DayJsDatetime implements Datetime {
  private dayjs: dayjs.Dayjs

  constructor(date?: Date | string | null) {
    this.dayjs = dayjs(date ?? new Date()).subtract(3, 'hours')
  }

  getDaysCountToSunday(): number {
    const todayIndex = dayjs().day()
    const sundayIndex = 0
    const daysCount = todayIndex === sundayIndex ? 7 : 7 - todayIndex

    return daysCount
  }

  getTodayIndex(): number {
    return this.dayjs.day()
  }

  getYesterdayWeekdayIndex(): number {
    return this.dayjs.subtract(1, 'day').day()
  }

  convertSecondsToTime(seconds: number): string {
    return dayjs(seconds * 1000).format('mm:ss')
  }

  format(dateFormat: DateFormat): string {
    return this.dayjs.format(dateFormat)
  }

  getRelativeTime(): string {
    return this.dayjs.fromNow()
  }

  date(): Date {
    return this.dayjs.toDate()
  }
}
