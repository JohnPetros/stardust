import { z } from 'zod'

import {
  emailSchema,
  idSchema,
  integerSchema,
  nameSchema,
  stringSchema,
} from '../global/schemas'
import { textsListSchema } from './textsListSchema'
import { avatarAggregateSchema } from './avatarAggregateSchema'
import { rocketAggregateSchema } from './rocketAggregateSchema'
import { tierAggregateSchema } from './tierAggregateSchema'

export const userSchema = z.object({
  id: idSchema.optional(),
  slug: stringSchema.optional(),
  level: integerSchema.optional(),
  coins: integerSchema.optional(),
  xp: integerSchema.optional(),
  weeklyXp: integerSchema.optional(),
  streak: integerSchema.optional(),
  weekStatus: textsListSchema.optional(),
  email: emailSchema,
  name: nameSchema,
  avatar: avatarAggregateSchema,
  rocket: rocketAggregateSchema,
  tier: tierAggregateSchema,
})
