import type { apiKeyModel } from '../../../models/auth/api-key-model'

export type DrizzleApiKey = typeof apiKeyModel.$inferSelect
export type DrizzleInsertApiKey = typeof apiKeyModel.$inferInsert
