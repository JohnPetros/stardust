import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import type { IDatetime } from '#interfaces'
import type { DateFormat } from '../../../interfaces/libs/IDatetime'

dayjs.locale('pt-br')

export class DayJsDatetime implements IDatetime {
  dayjs: dayjs.Dayjs

  constructor(date?: Date) {
    this.dayjs = dayjs(date ?? new Date())
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
}
