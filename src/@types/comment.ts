import { User } from './user'

export type Comment = {
  id: string
  content: string
  challenge_id: string
  parent_comment_id: string | null
  created_at: Date
  user: Pick<User, 'slug' | 'avatar_id'>
  replies?: Comment[]
  upvotes?: number
  isVoted?: boolean
}
