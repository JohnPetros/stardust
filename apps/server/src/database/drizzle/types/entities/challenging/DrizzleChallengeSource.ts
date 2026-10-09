import type { challengeSourceModel } from '../../../models/challenging/challenge-source-model'
import type { challengeModel } from '../../../models/challenging/challenge-model'
export type DrizzleChallengeSource = typeof challengeSourceModel.$inferSelect & {
  challenge: Pick<typeof challengeModel.$inferSelect, 'id' | 'title' | 'slug'> | null
}
export type DrizzleInsertChallengeSource = typeof challengeSourceModel.$inferInsert
