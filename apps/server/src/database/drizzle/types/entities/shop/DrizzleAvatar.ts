import type { avatarModel } from '../../../models/shop/avatar-model'

export type DrizzleAvatar = typeof avatarModel.$inferSelect
export type DrizzleInsertAvatar = typeof avatarModel.$inferInsert
