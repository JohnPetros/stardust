import type { Category } from './category'
import type { Text } from './text'

type Difficulty = 'easy' | 'medium' | 'hard'

type TestCase = {
  input: (string | number | boolean)[] | (string | number | boolean)[][]
}

export type Challenge = {
  id: string
  title: string
  code: string
  user_id: string
  difficulty: Difficulty
  created_at: string
  function_name: string | null
  upvotes: number
  downvotes: number
  texts: Text[]
  star_id: string | null
  test_cases: TestCase[]
  topic_id: string | null
  total_completitions: number
  categories: (Category | null)[]
  users_completed_challenges?: { count: number }[]
  users?: { name: string }[]
  is_completed: boolean
}
