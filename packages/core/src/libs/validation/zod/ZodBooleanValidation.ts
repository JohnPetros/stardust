import { type ZodBoolean, z, ZodError } from 'zod'

import { ZodValidationErrorFactory } from './ZodValidationErrorFactory'

export class ZodBooleanValidation {
  private data: unknown
  private key: string
  private zodBoolean: ZodBoolean

  constructor(data: unknown, key: string, message?: string) {
    this.data = data
    this.key = key
    this.zodBoolean = z.boolean({
      required_error: message ?? 'deve ser verdadeiro ou falso',
    })
  }

  validate() {
    try {
      z.object({ [this.key]: this.zodBoolean }).parse({ [this.key]: this.data })
    } catch (error) {
      if (error instanceof ZodError) throw ZodValidationErrorFactory.produce(error)
    }
  }
}
