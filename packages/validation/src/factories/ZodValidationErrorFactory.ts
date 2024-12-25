import { ValidationError } from '@stardust/core'
import type { ZodError } from 'zod'

export class ZodValidationErrorFactory {
  static produce(zodError: ZodError) {
    const fieldErrors = zodError.flatten().fieldErrors

    return new ValidationError(
      Object.entries(fieldErrors).map(([field, messages]) => ({
        name: field,
        messages: messages ?? [],
      })),
    )
  }
}
