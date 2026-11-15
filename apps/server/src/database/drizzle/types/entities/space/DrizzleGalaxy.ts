import type { galaxyModel } from '../../../models/space/galaxy-model'

export type DrizzleGalaxy = typeof galaxyModel.$inferSelect & {
  planetsIds: string[]
}
export type DrizzleInsertGalaxy = typeof galaxyModel.$inferInsert
