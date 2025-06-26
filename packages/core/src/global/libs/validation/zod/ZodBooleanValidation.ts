import { type ZodBoolean, z, ZodError, type ZodLiteral } from 'zod'

import { ZodValidationErrorFactory } from './ZodValidationErrorFactory'
import type { BooleanValidation } from '../../../interfaces/libs/BooleanValidation'

export class ZodBooleanValidation implements BooleanValidation {
  private data: unknown
  private key: string
  private zodBoolean: ZodBoolean | ZodLiteral<boolean>

  constructor(data: unknown, key?: string, message?: string) {
    this.data = data
    this.key = key ?? 'Valor lógico'
    this.zodBoolean = z.boolean({
      required_error: message ?? 'deve ser verdadeiro ou falso',
    })
  }

  true() {
    this.zodBoolean = z.literal(true)
    return this
  }

  false() {
    this.zodBoolean = z.literal(false)
    return this
  }

  validate() {
    try {
      z.object({ [this.key]: this.zodBoolean }).parse({ [this.key]: this.data })
    } catch (error) {
      if (error instanceof ZodError) throw ZodValidationErrorFactory.produce(error)
    }
  }
}
