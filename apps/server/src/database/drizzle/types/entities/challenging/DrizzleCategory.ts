import type { categoryModel } from '../../../models/challenging/category-model'

export type DrizzleCategory = typeof categoryModel.$inferSelect
export type DrizzleInsertCategory = typeof categoryModel.$inferInsert
