import type { Achievement } from '@stardust/core/profile/entities'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'
import type { Id } from '@stardust/core/global/structures'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabaseAchievementMapper } from '../../mappers/profile'

export class SupabaseAchievementsRepository
  extends SupabaseRepository
  implements AchievementsRepository
{
  async findById(achievementId: Id): Promise<Achievement | null> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const achievement = SupabaseAchievementMapper.toEntity(data)
    return achievement
  }

  async findAll(): Promise<Achievement[]> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }
    const achievements = data.map(SupabaseAchievementMapper.toEntity)
    return achievements
  }

  async findAllUnlockedByUser(userId: Id): Promise<Achievement[]> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*, users_unlocked_achievements!inner(user_id)')
      .eq('users_unlocked_achievements.user_id', userId)
      .order('position', { ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const achievements = data.map(SupabaseAchievementMapper.toEntity)

    return achievements
  }

  async addUnlocked(achievement: Achievement, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_unlocked_achievements')
      .insert({ achievement_id: achievement.id.value, user_id: userId })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async addRescuable(achievement: Achievement, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_rescuable_achievements')
      .insert({ achievement_id: achievement.id.value, user_id: userId })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async removeRescuable(achievementId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_rescuable_achievements')
      .delete()
      .match({
        achievement_id: achievementId,
        user_id: userId,
      })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
