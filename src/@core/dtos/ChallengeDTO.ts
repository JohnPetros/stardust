import type { ChallengeCategoryDTO } from './ChallengeCategoryDTO'

export type ChallengeDTO = {
  id?: string
  title: string
  code: string
  slug: string
  difficulty: string
  docId?: string | null
  functionName?: string | null
  // userSlug: string
  // createdAt: string
  // texts: Text[]
  // description: string
  // starId: string | null
  // testCases: ChallengeTestCase[]
  // upvotesCount: number
  // downvotesCount: number
  // totalCompletitions: number
  // categories?: Pick<Category, 'name'>[]
  // isCompleted?: boolean
}
