import { Datetime, DateValidation } from '#global/libs/index'
import { ValidationError } from '../errors'

export class Period {
  private constructor(
    readonly startDate: Date,
    readonly endDate: Date,
  ) {}

  static create(startDate: string, endDate: string) {
    const start = new Datetime(startDate).date()
    const end = new Datetime(endDate).date()
    new DateValidation(end, 'data final do Período').validate()
    new DateValidation(start, 'data inicial do Período').validate()

    if (start.getTime() > end.getTime()) {
      throw new ValidationError([
        {
          name: 'Data inicial',
          messages: ['Data final deve ser maior que a data inicial'],
        },
      ])
    }

    return new Period(start, end)
  }
}
