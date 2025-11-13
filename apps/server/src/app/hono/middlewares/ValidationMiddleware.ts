import type { ZodSchema } from 'zod'
import type { ValidationTargets } from 'hono'
import { zValidator } from '@hono/zod-validator'

import { ZodValidationErrorFactory } from '@stardust/validation/factories'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

export class ValidationMiddleware {
  validate<Schema extends ZodSchema, Target extends keyof ValidationTargets>(
    target: Target,
    schema: Schema,
  ) {
    return zValidator(target, schema, (result, context) => {
      if (!result.success) {
        const error = ZodValidationErrorFactory.produce(result.error)
        return context.json(error, HTTP_STATUS_CODE.badRequest)
      }
    })
  }
}
