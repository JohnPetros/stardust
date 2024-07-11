import { type SafeParseReturnType, ZodError } from 'zod'

import { ValidationResponse } from '@/@core/responses'

import { emailSchema } from './schemas/email-schema'
import type { Email } from '@/@core/domain/structs'
import type { IValidation } from '@/@core/interfaces/libs'

export class ZodValidation implements IValidation {
  validateEmail(email: Email) {
    const validationResult = emailSchema.safeParse(email.value)
    return this.respond(validationResult)
  }

  private respond(validation: SafeParseReturnType<string, string>) {
    return new ValidationResponse(
      validation.success,
      !validation.success ? validation?.error.format()._errors : []
    )
  }
}
