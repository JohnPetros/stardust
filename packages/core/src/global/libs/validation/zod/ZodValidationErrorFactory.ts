import { ValidationError } from '../../../domain/errors'
import type { ZodError } from 'zod'

export class ZodValidationErrorFactory {
  static produce(zodError: ZodError) {
    const fieldErrors: Record<string, string[]> = {}

    for (const issue of zodError.issues) {
      const field = issue.path.at(-1)
      if (field && field in fieldErrors) {
        fieldErrors[field]?.push(issue.message)
      } else if (field) fieldErrors[field] = [issue.message]
    }

    return new ValidationError(
      Object.entries(fieldErrors).map(([field, messages]) => ({
        name: field,
        messages: messages ?? [],
      })),
    )
  }
}
