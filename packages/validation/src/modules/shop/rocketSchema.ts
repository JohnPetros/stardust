import { z } from 'zod'
import { booleanSchema, integerSchema, stringSchema } from '../global/schemas'

export const rocketSchema = z.object({
  name: stringSchema.min(1, 'Nome é obrigatório'),
  image: stringSchema.min(1, 'Imagem é obrigatória'),
  price: integerSchema.min(0, 'Preço deve ser maior ou igual a 0'),
  isAcquiredByDefault: booleanSchema.optional(),
  isSelectedByDefault: booleanSchema.optional(),
})
