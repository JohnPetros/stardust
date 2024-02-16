import { Category } from './Category'
import type { Text } from './Text'

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard'

export type ChallengeTestCaseInput = (string | number)[] | (string | number)[][]

export type ChallengeTestCaseExpectedOutput =
  | string
  | number
  | (string | number)[]

export type ChallengeTestCase = {
  id: number
  input: ChallengeTestCaseInput
  expectedOutput: ChallengeTestCaseExpectedOutput
  isLocked: boolean
}

export type Challenge = {
  id: string
  title: string
  code: string
  slug: string
  userSlug: string
  difficulty: ChallengeDifficulty
  createdAt: string
  functionName: string | null
  texts: Text[]
  description: string
  starId: string | null
  testCases: ChallengeTestCase[]
  docId: string | null
  upvotesCount: number
  downvotesCount: number
  totalCompletitions: number
  categories?: Pick<Category, 'name'>[]
  isCompleted?: boolean
}
