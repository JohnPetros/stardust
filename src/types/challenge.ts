import type { Category } from './category'

type Difficulty = 'easy' | 'medium' | 'hard'

export type Challenge = {
  id: string
  code: string
  author: string
  difficulty: Difficulty
  created_at: string
  function_name: string | null
  upvotes: number
  downvotes: number
  texts: JSON
  star_id: string | null
  test_cases: JSON
  title: string
  topic_id: string
  total_completitions: number
  categories: (Category | null)[]
}
