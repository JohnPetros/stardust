import type { Id } from '#global/domain/structures/Id'
import type { Achievement } from '../domain/entities'

export interface AchievementsRepository {
  findById(achievementId: Id): Promise<Achievement | null>
  findAll(): Promise<Achievement[]>
  findAllUnlockedByUser(userId: Id): Promise<Achievement[]>
  addUnlocked(achievement: Achievement, userId: Id): Promise<void>
  addRescuable(achievement: Achievement, userId: Id): Promise<void>
  removeRescuable(achievementId: Id, userId: Id): Promise<void>
}
