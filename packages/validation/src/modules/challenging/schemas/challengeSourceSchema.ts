import { z } from 'zod'

import { idSchema } from '../../global/schemas'

export const challengeSourceSchema = z.object({
  url: z.string().url(),
  challengeId: idSchema.optional().nullable(),
})
