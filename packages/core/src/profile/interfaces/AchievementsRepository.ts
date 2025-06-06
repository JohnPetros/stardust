import type { Id } from '#global/domain/structures/Id'
import type { Achievement } from '../domain/entities'

export interface AchievementsRepository {
  findById(achievementId: Id): Promise<Achievement | null>
  findAll(): Promise<Achievement[]>
  findAllUnlockedByUser(userId: Id): Promise<Achievement[]>
}
