import { z } from 'zod'

import { stringSchema } from '../../global/schemas'

export const challengeCodeExecutionSchema = z.object({
  code: stringSchema,
})
