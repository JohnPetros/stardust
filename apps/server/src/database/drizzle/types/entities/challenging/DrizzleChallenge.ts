import type { challengeModel } from '../../../models/challenging/challenge-model'
import type { userModel } from '../../../models/profile/user-model'
import type { avatarModel } from '../../../models/shop/avatar-model'
import type { categoryModel } from '../../../models/challenging/category-model'

export type DrizzleChallenge = typeof challengeModel.$inferSelect & {
  authorId: (typeof userModel.$inferSelect)['id'] | null
  authorName: (typeof userModel.$inferSelect)['name'] | null
  authorSlug: (typeof userModel.$inferSelect)['slug'] | null
  authorAvatarName: (typeof avatarModel.$inferSelect)['name'] | null
  authorAvatarImage: (typeof avatarModel.$inferSelect)['image'] | null
  upvotesCount: number
  downvotesCount: number
  totalCompletitions: number
  categories: Pick<typeof categoryModel.$inferSelect, 'id' | 'name'>[]
}

export type DrizzleInsertChallenge = typeof challengeModel.$inferInsert
