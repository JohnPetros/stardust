import type { noteModel } from '../../../models/profile/note-model'

export type DrizzleNote = typeof noteModel.$inferSelect
export type DrizzleInsertNote = typeof noteModel.$inferInsert
