import type { rankingUserModel } from '../../../models/ranking/ranking-user-model'
import type { userModel } from '../../../models/profile/user-model'
import type { avatarModel } from '../../../models/shop/avatar-model'

export type DrizzleRankingUser = Pick<
  typeof rankingUserModel.$inferSelect,
  'id' | 'tierId' | 'xp' | 'position'
> & {
  user:
    | (Pick<typeof userModel.$inferSelect, 'name' | 'slug'> & {
        avatar: Pick<typeof avatarModel.$inferSelect, 'image' | 'name'> | null
      })
    | null
}

export type DrizzleInsertRankingUser = typeof rankingUserModel.$inferInsert
