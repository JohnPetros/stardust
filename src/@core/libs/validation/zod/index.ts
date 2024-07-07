import { type SafeParseReturnType, ZodError } from 'zod'

import { Email } from '@/@core/domain/structs/Email'
import { ValidationResponse } from '@/@core/responses'
import { IValidation } from '@/@core/interfaces/libs'

import { emailSchema } from './schemas/email-schema'

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
