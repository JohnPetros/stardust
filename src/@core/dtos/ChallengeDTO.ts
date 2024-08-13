export type ChallengeDTO = {
  id?: string
  title: string
  code: string
  slug: string
  difficulty: string
  docId?: string
  starId?: string
  // userSlug: string
  // createdAt: string
  // functionName: string | null
  // texts: Text[]
  // description: string
  // starId: string | null
  // testCases: ChallengeTestCase[]
  // upvotesCount: number
  // downvotesCount: number
  // totalCompletitions: number
  // categories?: Pick<Category, 'name'>[]
  // isCompleted?: boolean
}
