import type { Category } from './category'
import type { Text } from './text'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type TestCase = {
  id: number
  input: (string | number)[] | (string | number)[][]
  expectedOutput: string | number | (string | number)[]
  isLocked: boolean
}

export type Challenge = {
  id: string
  title: string
  code: string
  slug: string
  user_slug: string
  difficulty: Difficulty
  created_at: string
  function_name: string | null
  upvotes: number
  downvotes: number
  texts?: Text[]
  description: string
  star_id: string | null
  test_cases: TestCase[]
  topic_id: string | null
  total_completitions: number
  categories?: Category[]
  isCompleted: boolean
}
