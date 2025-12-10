import type { Id } from '#global/domain/structures/Id'
import type { Achievement } from '../domain/entities'

export interface AchievementsRepository {
  findById(achievementId: Id): Promise<Achievement | null>
  findLastByPosition(): Promise<Achievement | null>
  findAll(): Promise<Achievement[]>
  findAllUnlockedByUser(userId: Id): Promise<Achievement[]>
  add(achievement: Achievement): Promise<void>
  replace(achievement: Achievement): Promise<void>
  replaceMany(achievements: Achievement[]): Promise<void>
  remove(achievement: Achievement): Promise<void>
}
