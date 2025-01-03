import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import type { IDatetime } from '#interfaces'
import type { DateFormat } from '../../../interfaces/libs/IDatetime'

dayjs.locale('pt-br')

export class DayJsDatetime implements IDatetime {
  getDaysCountToSunday(): number {
    const todayIndex = dayjs().day()
    const sundayIndex = 0
    const daysCount = todayIndex === sundayIndex ? 7 : 7 - todayIndex

    return daysCount
  }

  getTodayIndex(): number {
    return dayjs().day()
  }

  convertSecondsToTime(seconds: number): string {
    return dayjs(seconds * 1000).format('mm:ss')
  }

  format(date: Date, dateFormat: DateFormat): string {
    return dayjs(date).format(dateFormat)
  }
}
