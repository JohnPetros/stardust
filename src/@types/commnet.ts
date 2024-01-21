import { User } from './user'

export type Comment = {
  id: string
  user: Pick<User, 'slug' | 'name' | 'avatar_id'>
  content: string
  challenge_id: string
  parent_comment_id: string
  created_at: Date
  replies?: Comment[]
  upvotes?: number
}
