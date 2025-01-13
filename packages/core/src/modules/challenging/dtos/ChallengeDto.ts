import type { AuthorDto, TextBlockDto } from '#global/dtos'
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
  author: {
    id: string
    dto?: AuthorDto
  }
  docId?: string | null
  starId?: string | null
  downvotesCount?: number
  upvotesCount?: number
  completionsCount?: number
  postedAt?: Date
  textBlocks?: TextBlockDto[]
  categories: ChallengeCategoryDto[]
  function?: ChallengeFunctionDto
  userOutputs?: unknown[]
  results?: boolean[]
}
