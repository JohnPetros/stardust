import type z from 'zod'
import type { challengeSchema } from '../schemas'

export type ChallengeSchema = z.infer<typeof challengeSchema>
