import type { AuthorAggregateDto } from '#global/domain/aggregates/dtos/AuthorAggregateDto'
import type { CodePlaybackDto } from '#global/domain/structures/dtos/CodePlaybackDto'
import type { ChallengeCategoryDto } from './ChallengeCategoryDto'
import type { ChallengeFunctionDto } from './ChallengeFunctionDto'
import type { TestCaseDto } from './TestCaseDto'

export type ChallengeDto = {
  id?: string
  title: string
  initialCode: string
  slug?: string
  difficultyLevel: string
  description: string
  testCases: TestCaseDto[]
  author: AuthorAggregateDto
  starId?: string | null
  categories: ChallengeCategoryDto[]
  isPublic?: boolean
  isNew?: boolean
  isEvaluatedByFunction?: boolean
  downvotesCount?: number
  upvotesCount?: number
  completionCount?: number
  postedAt?: Date
  function?: ChallengeFunctionDto
  userOutputs?: unknown[]
  results?: boolean[]
  officialSolution?: CodePlaybackDto | null
}
