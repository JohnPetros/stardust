import type { achievementModel } from '../../../models/profile/achievement-model'

export type DrizzleAchievement = typeof achievementModel.$inferSelect
export type DrizzleInsertAchievement = typeof achievementModel.$inferInsert
