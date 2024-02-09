import { User } from './User'

export type Comment = {
  id: string
  content: string
  challenge_id: string
  created_at: Date
  parent_comment_id: string | null
  user: Pick<User, 'slug' | 'avatar_id'>
  repliesAmount?: number
  upvotes?: number
  isVoted?: boolean
}
