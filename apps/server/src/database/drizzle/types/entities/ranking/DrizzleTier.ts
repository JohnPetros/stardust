import type { tierModel } from '../../../models/ranking/tier-model'

export type DrizzleTier = typeof tierModel.$inferSelect
export type DrizzleInsertTier = typeof tierModel.$inferInsert
