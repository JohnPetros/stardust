import type { ChallengeCompletionStatus } from '../domain/types'

export type ChallengesListParams = {
  completionStatus: ChallengeCompletionStatus
  difficulty: string
  title: string
  categoriesIds: string[]
}
