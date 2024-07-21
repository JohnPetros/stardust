import { StringValidation } from '@/@core/lib/validation'
import { ValidationError } from '@/@core/errors/lib'
import type { WeekdayStatus } from '../types'

export class WeekStatus {
  static readonly DAYS: string[] = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

  private constructor(readonly statuses: WeekdayStatus[] = []) {}

  static create(values: string[]) {
    if (!WeekStatus.isStatus(values)) {
      throw new ValidationError(['Weekday Statuses are not valid'])
    }

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
}
