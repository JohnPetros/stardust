import type { TextBlockDto } from '../../global/dtos'

export type ChallengeDto = {
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
  descriptionTextBlocks: TextBlockDto[]
  description: string
  // testCases: ChallengeTestCase[]
}
