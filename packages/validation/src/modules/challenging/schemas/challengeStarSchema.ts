import { z } from 'zod'

import { idSchema } from '../../global/schemas/idSchema'

export const challengeStarSchema = z.object({
  starId: idSchema,
})
