import type z from 'zod'

import type { challengeFormSchema } from '../schemas/challengeFormSchema'

export type ChallengeSchema = z.infer<typeof challengeFormSchema>
