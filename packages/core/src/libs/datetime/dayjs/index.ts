import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

import type { IDatetime } from '#interfaces'
import type { DateFormat } from '../../../interfaces/libs/IDatetime'

dayjs.locale('pt-br')
dayjs.extend(relativeTime)

export class DayJsDatetime implements IDatetime {
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

  convertSecondsToTime(seconds: number): string {
    return dayjs(seconds * 1000).format('mm:ss')
  }

  format(dateFormat: DateFormat): string {
    return this.dayjs.format(dateFormat)
  }

  getRelativeTime(): string {
    return this.dayjs.from(this.date())
  }

  date(): Date {
    return this.dayjs.toDate()
  }
}
