import type { TextBlockDto } from '#global/dtos'
import type { ChallengeCategoryDto } from './ChallengeCategoryDto'
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
  categories: ChallengeCategoryDto[]
  userOutputs?: unknown[]
  results?: boolean[]
  description: string
  testCases: TestCaseDto[]
}
