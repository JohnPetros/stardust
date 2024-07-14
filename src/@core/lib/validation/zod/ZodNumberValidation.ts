import { z, type ZodNumber, ZodError } from 'zod'

import { ValidationError } from '@/@core/errors/lib'
import type { INumberValidation } from '@/@core/interfaces/lib'

export class ZodNumberValidation implements INumberValidation {
  private data: unknown
  private key: string
  private zodNumber: ZodNumber

  constructor(data: unknown, key: string, message?: string) {
    this.data = data
    this.key = key
    this.zodNumber = z.number({
      required_error: message ?? `${key} value must be a number`,
    })
  }

  min(minValue: number, message?: string) {
    this.zodNumber = this.zodNumber.min(minValue, {
      message:
        message ?? `${this.key} value must be greater than or equal to ${minValue}`,
    })
    return this
  }

  max(maxValue: number, message?: string) {
    this.zodNumber = this.zodNumber.min(maxValue, {
      message: message ?? `${this.key} value must lower than or equal to ${maxValue}`,
    })
    return this
  }

  validate() {
    try {
      this.zodNumber.parse(this.data)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(error.flatten().formErrors)
      }
    }
  }
}
