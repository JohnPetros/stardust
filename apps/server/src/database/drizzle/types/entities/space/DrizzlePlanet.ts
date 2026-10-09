import type { planetModel } from '../../../models/space/planet-model'
import type { DrizzleStar } from './DrizzleStar'

export type DrizzlePlanet = typeof planetModel.$inferSelect & {
  stars: DrizzleStar[]
  completionCount: number
  userCount: number
}
export type DrizzleInsertPlanet = typeof planetModel.$inferInsert
