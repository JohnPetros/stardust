import type { solutionModel } from '../../../models/challenging/solution-model'
import type { userModel } from '../../../models/profile/user-model'
import type { avatarModel } from '../../../models/shop/avatar-model'

export type DrizzleSolution = typeof solutionModel.$inferSelect & {
  authorId: (typeof userModel.$inferSelect)['id'] | null
  authorName: (typeof userModel.$inferSelect)['name'] | null
  authorSlug: (typeof userModel.$inferSelect)['slug'] | null
  authorAvatarName: (typeof avatarModel.$inferSelect)['name'] | null
  authorAvatarImage: (typeof avatarModel.$inferSelect)['image'] | null
  upvotesCount: number
  commentsCount: number
}

export type DrizzleInsertSolution = typeof solutionModel.$inferInsert
