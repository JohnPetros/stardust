import { z } from 'zod'

import { idSchema } from './idSchema'
import { nameSchema } from './nameSchema'
import { slugSchema } from './slugSchema'
import { stringSchema } from './stringSchema'

export const authorAggregateSchema = z.object({
  id: idSchema,
  entity: z
    .object({
      name: nameSchema,
      slug: slugSchema,
      avatar: z.object({
        image: stringSchema,
        name: nameSchema,
      }),
    })
    .optional(),
})
