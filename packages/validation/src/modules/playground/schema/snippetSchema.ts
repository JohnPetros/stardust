import { z } from 'zod'
import { titleSchema } from '../../global/schemas/titleSchema'
import { stringSchema } from '../../global/schemas/stringSchema'
import { booleanSchema } from '../../global/schemas/booleanSchema'

export const snippetSchema = z.object({
  title: titleSchema,
  code: stringSchema,
  isPublic: booleanSchema,
})
