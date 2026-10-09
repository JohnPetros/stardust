import type { commentModel } from '../../../models/forum/comment-model'
import type { userModel } from '../../../models/profile/user-model'
import type { avatarModel } from '../../../models/shop/avatar-model'

export type DrizzleComment = typeof commentModel.$inferSelect & {
  authorId: (typeof userModel.$inferSelect)['id'] | null
  authorName: (typeof userModel.$inferSelect)['name'] | null
  authorSlug: (typeof userModel.$inferSelect)['slug'] | null
  authorAvatarName: (typeof avatarModel.$inferSelect)['name'] | null
  authorAvatarImage: (typeof avatarModel.$inferSelect)['image'] | null
  upvotesCount: number
  repliesCount: number
}

export type DrizzleInsertComment = typeof commentModel.$inferInsert
