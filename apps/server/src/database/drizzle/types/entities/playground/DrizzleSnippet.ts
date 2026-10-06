import type { snippetModel } from '../../../models/playground/snippet-model'
import type { userModel } from '../../../models/profile/user-model'
import type { avatarModel } from '../../../models/shop/avatar-model'

export type DrizzleSnippet = typeof snippetModel.$inferSelect & {
  authorId: (typeof userModel.$inferSelect)['id'] | null
  authorName: (typeof userModel.$inferSelect)['name'] | null
  authorSlug: (typeof userModel.$inferSelect)['slug'] | null
  authorAvatarName: (typeof avatarModel.$inferSelect)['name'] | null
  authorAvatarImage: (typeof avatarModel.$inferSelect)['image'] | null
}
export type DrizzleInsertSnippet = typeof snippetModel.$inferInsert
