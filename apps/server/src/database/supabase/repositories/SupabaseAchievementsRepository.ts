import type { Achievement } from '@stardust/core/profile/entities'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'
import type { Id } from '@stardust/core/global/structures'

import { SupabaseRepository } from './SupabaseRepository'
import { SupabasePostgreError } from '../errors'
import { SupabaseAchievementMapper } from '../mappers'

export class SupabaseAchievementsRepository
  extends SupabaseRepository
  implements AchievementsRepository
{
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

  async deleteRescuable(achievement: Achievement, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_rescuable_achievements')
      .delete()
      .match({
        achievement_id: achievement.id.value,
        user_id: userId,
      })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
