export type Solution = {
  id: string
  title: string
  content: string
  slug: string
  commentsCount: number
  upvotesCount: number
  challengeId: string
  createdAt: Date
  user: {
    slug: string
    avatarId: string
  }
}
