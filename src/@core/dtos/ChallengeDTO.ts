import type { ChallengeCategoryDTO } from './ChallengeCategoryDTO'

export type ChallengeDTO = {
  id?: string
  title: string
  code: string
  slug: string
  difficulty: string
  authorSlug: string
  docId?: string | null
  starId?: string | null
  functionName?: string | null
  downvotesCount: number
  upvotesCount: number
  completionsCount: number
  createdAt: Date
  // texts: Text[]
  // description: string
  // starId: string | null
  // testCases: ChallengeTestCase[]
}
