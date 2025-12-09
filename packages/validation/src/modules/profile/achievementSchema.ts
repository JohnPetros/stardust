import { z } from 'zod'
import {
  idSchema,
  integerSchema,
  ordinalNumberSchema,
  stringSchema,
} from '../global/schemas'

const achievementMetricSchema = z.enum([
  'unlockedStarsCount',
  'acquiredRocketsCount',
  'completedChallengesCount',
  'completedPlanetsCount',
  'xp',
  'streak',
])

export const achievementSchema = z.object({
  id: idSchema.optional(),
  name: stringSchema.min(3, 'nome deve conter pelo menos 3 caracteres'),
  icon: stringSchema,
  description: stringSchema.min(3, 'descrição deve conter pelo menos 3 caracteres'),
  reward: integerSchema,
  requiredCount: integerSchema,
  position: ordinalNumberSchema,
  metric: achievementMetricSchema,
})
