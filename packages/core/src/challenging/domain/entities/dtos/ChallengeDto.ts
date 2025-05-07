import type { AuthorAggregateDto } from '#global/domain/aggregates/dtos/AuthorAggregateDto'
import type { ChallengeCategoryDto } from './ChallengeCategoryDto'
import type { ChallengeFunctionDto } from './ChallengeFunctionDto'
import type { TestCaseDto } from './TestCaseDto'

export type ChallengeDto = {
  id?: string
  title: string
  code: string
  slug?: string
  difficultyLevel: string
  description: string
  testCases: TestCaseDto[]
  author: AuthorAggregateDto
  starId?: string | null
  categories: ChallengeCategoryDto[]
  isPublic?: boolean
  downvotesCount?: number
  upvotesCount?: number
  completionsCount?: number
  postedAt?: Date
  function?: ChallengeFunctionDto
  userOutputs?: unknown[]
  results?: boolean[]
}
