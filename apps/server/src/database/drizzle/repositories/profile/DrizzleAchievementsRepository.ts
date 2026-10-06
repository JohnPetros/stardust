import { asc, desc, eq, getTableColumns } from 'drizzle-orm'
import type { Achievement } from '@stardust/core/profile/entities'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'
import type { Id } from '@stardust/core/global/structures'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { achievementModel } from '../../models/profile/achievement-model'
import { userUnlockedAchievementModel } from '../../models/profile/user-unlocked-achievement-model'
import { DrizzleAchievementMapper } from '../../mappers/profile/DrizzleAchievementMapper'

export class DrizzleAchievementsRepository
  extends DrizzleRepository
  implements AchievementsRepository
{
  private authorizeWrite(): void {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
  }

  async findById(achievementId: Id): Promise<Achievement | null> {
    return this.findOneResult(
      async () =>
        this.database
          .select()
          .from(achievementModel)
          .where(eq(achievementModel.id, achievementId.value))
          .limit(1),
      DrizzleAchievementMapper.toEntity,
    )
  }

  async findLastByPosition(): Promise<Achievement | null> {
    return this.findOneResult(
      async () =>
        this.database
          .select()
          .from(achievementModel)
          .orderBy(desc(achievementModel.position))
          .limit(1),
      DrizzleAchievementMapper.toEntity,
    )
  }

  async findAll(): Promise<Achievement[]> {
    return this.findManyResults(
      async () =>
        this.database
          .select()
          .from(achievementModel)
          .orderBy(asc(achievementModel.position)),
      DrizzleAchievementMapper.toEntity,
    )
  }

  private authorizeUser(userId: Id): void {
    if (
      this.access.kind === 'public' ||
      (this.access.kind === 'user' && this.access.accountId.value !== userId.value)
    )
      throw new AuthError('Conta não autorizada')
  }

  async findAllUnlockedByUser(userId: Id): Promise<Achievement[]> {
    this.authorizeUser(userId)
    return this.findManyResults(
      async () => this.unlockedQuery(userId),
      DrizzleAchievementMapper.toEntity,
    )
  }

  private unlockedSelection() {
    return this.database
      .select(getTableColumns(achievementModel))
      .from(achievementModel)
      .innerJoin(
        userUnlockedAchievementModel,
        eq(userUnlockedAchievementModel.achievementId, achievementModel.id),
      )
  }

  private unlockedQuery(userId: Id) {
    return this.unlockedSelection()
      .where(eq(userUnlockedAchievementModel.userId, userId.value))
      .orderBy(asc(achievementModel.position))
  }

  async add(achievement: Achievement): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .insert(achievementModel)
        .values(DrizzleAchievementMapper.toPersistence(achievement))
    })
  }

  async addMany(achievements: Achievement[]): Promise<void> {
    this.authorizeWrite()
    if (!achievements.length) return
    await this.executeQuery(async () => {
      await this.database
        .insert(achievementModel)
        .values(achievements.map(DrizzleAchievementMapper.toPersistence))
    })
  }

  async replace(achievement: Achievement): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .update(achievementModel)
        .set(DrizzleAchievementMapper.toPersistence(achievement))
        .where(eq(achievementModel.id, achievement.id.value))
    })
  }

  async replaceMany(achievements: Achievement[]): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database.transaction(async (transaction) => {
        for (const achievement of achievements)
          await transaction
            .update(achievementModel)
            .set(DrizzleAchievementMapper.toPersistence(achievement))
            .where(eq(achievementModel.id, achievement.id.value))
      })
    })
  }

  async remove(achievement: Achievement): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .delete(achievementModel)
        .where(eq(achievementModel.id, achievement.id.value))
    })
  }
}
