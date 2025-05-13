import type { Id } from '#global/domain/structures/Id'
import type { Achievement } from '../domain/entities'

export interface AchievementsRepository {
  findAll(): Promise<Achievement[]>
  findAllUnlockedByUser(userId: Id): Promise<Achievement[]>
  addUnlocked(achievement: Achievement, userId: Id): Promise<void>
  addRescuable(achievement: Achievement, userId: Id): Promise<void>
  deleteRescuable(achievement: Achievement, userId: Id): Promise<void>
}
