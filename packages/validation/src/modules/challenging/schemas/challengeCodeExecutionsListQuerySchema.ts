import { z } from 'zod'

import { itemsPerPageSchema, pageSchema } from '../../global/schemas'

export const challengeCodeExecutionsListQuerySchema = z.object({
  page: pageSchema.default(1),
  itemsPerPage: itemsPerPageSchema.default(20),
})
