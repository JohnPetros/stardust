import { z, type ZodNumber, ZodError } from 'zod'

import type { INumberValidation } from '#interfaces'
import { ZodValidationErrorFactory } from './ZodValidationErrorFactory'

export class ZodNumberValidation implements INumberValidation {
  private data: unknown
  private key: string
  private zodNumber: ZodNumber

  constructor(data: unknown, key: string, message?: string) {
    this.data = data
    this.key = key
    this.zodNumber = z.number({
      required_error: message ?? 'deve ser um número',
    })
  }

  min(minValue: number, message?: string) {
    this.zodNumber = this.zodNumber.min(minValue, {
      message: message ?? `deve ser igual ou maior que ${minValue}`,
    })
    return this
  }

  max(maxValue: number, message?: string) {
    this.zodNumber = this.zodNumber.max(maxValue, {
      message: message ?? `deve ser igual ou menor que ${maxValue}`,
    })
    return this
  }

  equal(value: number, message?: string): this {
    this.zodNumber = this.zodNumber
      .min(value, {
        message: message ?? `deve ser igual a ${value}`,
      })
      .max(value, {
        message: message ?? `deve ser igual a ${value}`,
      })
    return this
  }

  validate() {
    try {
      z.object({ [this.key]: this.zodNumber }).parse({ [this.key]: this.data })
    } catch (error) {
      if (error instanceof ZodError) throw ZodValidationErrorFactory.produce(error)
    }
  }
}
