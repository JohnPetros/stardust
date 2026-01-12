import { type ZodDate, z, ZodError, type ZodLiteral } from 'zod'

import { ZodValidationErrorFactory } from './ZodValidationErrorFactory'
import type { DateValidation } from '../../../interfaces/libs/DateValidation'

export class ZodDateValidation implements DateValidation {
  private data: unknown
  private key: string
  private zodDate: ZodDate | ZodLiteral<Date>

  constructor(data: unknown, key?: string, message?: string) {
    this.data = data
    this.key = key ?? 'Valor lógico'
    this.zodDate = z.date({
      required_error: message ?? 'deve ser uma data válida',
    })
  }

  isLowerThan(date: Date) {
    this.zodDate = z.date().min(date)
    return this
  }

  validate() {
    try {
      z.object({ [this.key]: this.zodDate }).parse({ [this.key]: this.data })
    } catch (error) {
      if (error instanceof ZodError) throw ZodValidationErrorFactory.produce(error)
    }
  }
}
