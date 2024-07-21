import dayjs from 'dayjs'

import type { IDatetime } from '@/@core/interfaces/lib'
import type { DateFormat } from '@/@core/interfaces/lib/IDatetime'

export class DayJsDatetime implements IDatetime {
  getDaysCountToSunday(): number {
    const todayIndex = dayjs().day()
    const sundayIndex = 0
    const daysCount = todayIndex === sundayIndex ? 7 : 7 - todayIndex

    return daysCount
  }

  format(date: Date, dateFormat: DateFormat): string {
    return dayjs(date).format(dateFormat)
  }
}
