import { User } from './User'

export type Comment = {
  id: string
  content: string
  challengeId: string | null
  parentCommentId: string | null
  user: Pick<User, 'slug' | 'avatarId'>
  repliesCount: number
  upvotesCount: number
  createdAt: Date
  isVoted?: boolean
}
