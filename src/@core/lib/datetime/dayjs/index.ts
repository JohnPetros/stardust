import type { IDatetime } from '@/@core/interfaces/lib'

import dayjs from 'dayjs'

export class DayJsDatetime implements IDatetime {
  getDaysCountToSunday(): number {
    const todayIndex = dayjs().day()
    const sundayIndex = 0
    const daysCount = todayIndex === sundayIndex ? 7 : 7 - todayIndex

    return daysCount
  }

  format(): string {
    throw new Error('Method not implemented.')
  }
}
