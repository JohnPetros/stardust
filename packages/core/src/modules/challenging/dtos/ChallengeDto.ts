import type { TextBlockDto } from '#global/dtos'
import type { TestCaseDto } from './TestCaseDto'

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
  textBlocks: TextBlockDto[]
  description: string
  testCases: TestCaseDto[]
}
