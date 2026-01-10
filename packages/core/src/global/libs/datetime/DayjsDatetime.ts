import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

import type { DateFormat, Datetime } from '#global/interfaces/libs/Datetime'

dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export class DayJsDatetime implements Datetime {
  private dayjs: dayjs.Dayjs

  constructor(date?: Date | string | null) {
    this.dayjs = dayjs.utc(date ?? new Date())
  }

  formatTimeAgo(): string {
    const now = dayjs.utc()
    const diff = now.diff(this.dayjs, 'second')

    if (diff < 60) return 'Agora'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutos atrás`
    if (diff < 86400) return `${Math.floor(diff / 3600)} horas atrás`
    if (diff < 2592000) return `${Math.floor(diff / 86400)} dias atrás`

    return `${Math.floor(diff / 2592000)} meses atrás`
  }

  getDaysCountToSunday(): number {
    const todayIndex = dayjs.utc().day()
    const sundayIndex = 0
    return todayIndex === sundayIndex ? 7 : 7 - todayIndex
  }

  getEndOfDay(): Date {
    return this.dayjs.endOf('day').toDate()
  }

  getTodayIndex(): number {
    return this.dayjs.day()
  }

  getYesterdayWeekdayIndex(): number {
    return this.dayjs.subtract(1, 'day').day()
  }

  convertSecondsToTime(seconds: number): string {
    return dayjs.utc(seconds * 1000).format('mm:ss')
  }

  format(dateFormat: DateFormat): string {
    return this.dayjs.format(dateFormat)
  }

  getRelativeTime(): string {
    return this.dayjs.from(dayjs.utc())
  }

  addHours(hours: number): Date {
    return this.dayjs.add(hours, 'hour').toDate()
  }

  minusMonths(months: number): Date {
    return this.dayjs.subtract(months, 'month').toDate()
  }

  firstDayOfMonth(): Date {
    return this.dayjs.startOf('month').toDate()
  }

  lastDayOfMonth(): Date {
    return this.dayjs.endOf('month').toDate()
  }

  date(): Date {
    return this.dayjs.toDate()
  }
}
