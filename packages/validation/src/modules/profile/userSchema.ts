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
