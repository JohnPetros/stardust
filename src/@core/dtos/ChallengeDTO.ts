import type { ChallengeCategoryDTO } from './ChallengeCategoryDTO'
import type { TextBlockDTO } from './TextBlockDTO'

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
  descriptionTextBlocks: TextBlockDTO[]
  description: string
  // testCases: ChallengeTestCase[]
}
