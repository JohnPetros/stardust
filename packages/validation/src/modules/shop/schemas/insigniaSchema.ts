import { z } from 'zod'
import {
  idSchema,
  integerSchema,
  nameSchema,
  stringSchema,
  insigniaRoleSchema,
} from '../../global/schemas'

export const insigniaSchema = z.object({
  id: idSchema.optional(),
  name: nameSchema,
  price: integerSchema,
  image: stringSchema,
  role: insigniaRoleSchema,
})
