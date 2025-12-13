import { z } from 'zod'
import {
  idSchema,
  integerSchema,
  nameSchema,
  stringSchema,
  booleanSchema,
} from '../../global/schemas'

export const rocketSchema = z.object({
  id: idSchema.optional(),
  name: nameSchema,
  image: stringSchema,
  price: integerSchema,
  isAcquiredByDefault: booleanSchema.optional(),
  isSelectedByDefault: booleanSchema.optional(),
})
