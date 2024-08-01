import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import type { IDatetime } from '@/@core/interfaces/lib'
import type { DateFormat } from '@/@core/interfaces/lib/IDatetime'

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
    const date = new Date(0)
    date.setSeconds(seconds)

    const time = date.toISOString().substring(14, 19)
    return time
  }

  format(date: Date, dateFormat: DateFormat): string {
    return dayjs(date).format(dateFormat)
  }
}
