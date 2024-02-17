import { Category } from './Category'
import type { Text } from './Text'

type NestedArray<Value> = Value[] | NestedArray<Value>[]

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard'

export type ChallengeTestCaseInput = (
  | string
  | number
  | boolean
  | object
  | NestedArray<string | number | boolean | object>
)[]

export type ChallengeTestCaseExpectedOutput =
  | string
  | number
  | boolean
  | object
  | NestedArray<string | number | boolean | object>

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
