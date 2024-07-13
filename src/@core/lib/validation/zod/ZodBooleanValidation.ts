import { ValidationError } from '@/@core/errors/lib'
import { type ZodBoolean, z, ZodError } from 'zod'

export class ZodBooleanValidation {
  private data: unknown
  private key: string
  private zodBoolean: ZodBoolean

  constructor(data: unknown, key: string, message?: string) {
    this.data = data
    this.key = key
    this.zodBoolean = z.boolean({
      required_error: message ?? `${this.key} must be a boolean`,
    })
  }

  validate() {
    try {
      this.zodBoolean.parse(this.data)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(error.flatten().formErrors)
      }
    }
  }
}
