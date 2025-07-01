import { z } from 'zod'

import {
  emailSchema,
  idSchema,
  integerSchema,
  nameSchema,
  stringSchema,
} from '../global/schemas'
import {
  avatarAggregateSchema,
  rocketAggregateSchema,
  tierAggregateSchema,
} from '../profile'
import { textsListSchema } from './textsListSchema'

export const userSchema = z.object({
  id: idSchema.optional(),
  slug: stringSchema,
  email: emailSchema,
  name: nameSchema,
  level: integerSchema,
  coins: integerSchema,
  xp: integerSchema,
  weeklyXp: integerSchema,
  streak: integerSchema,
  weekStatus: textsListSchema,
  avatar: avatarAggregateSchema,
  rocket: rocketAggregateSchema,
  tier: tierAggregateSchema,
})
