import type { starModel } from '../../../models/space/star-model'

export type DrizzleStar = typeof starModel.$inferSelect & {
  userCount: number
  unlockCount: number
}
export type DrizzleInsertStar = typeof starModel.$inferInsert
