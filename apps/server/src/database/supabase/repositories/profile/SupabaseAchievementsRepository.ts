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
      .eq('id', achievementId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }
    return SupabaseAchievementMapper.toEntity(data)
  }

  async findLastByPosition(): Promise<Achievement | null> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*')
      .order('position', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }
    return SupabaseAchievementMapper.toEntity(data)
  }

  async findAll(): Promise<Achievement[]> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }
    return data.map(SupabaseAchievementMapper.toEntity)
  }

  async findAllUnlockedByUser(userId: Id): Promise<Achievement[]> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*, users_unlocked_achievements!inner(user_id)')
      .eq('users_unlocked_achievements.user_id', userId.value)
      .order('position', { ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }
    return data.map(SupabaseAchievementMapper.toEntity)
  }

  async add(achievement: Achievement): Promise<void> {
    const supabaseAchievement = SupabaseAchievementMapper.toSupabase(achievement)
    const { error } = await this.supabase.from('achievements').insert({
      id: achievement.id.value,
      name: supabaseAchievement.name,
      icon: supabaseAchievement.icon,
      reward: supabaseAchievement.reward,
      description: supabaseAchievement.description,
      metric: supabaseAchievement.metric,
      position: supabaseAchievement.position,
      required_count: supabaseAchievement.required_count,
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replace(achievement: Achievement): Promise<void> {
    const supabaseAchievement = SupabaseAchievementMapper.toSupabase(achievement)
    const { error } = await this.supabase
      .from('achievements')
      .update({
        name: supabaseAchievement.name,
        icon: supabaseAchievement.icon,
        reward: supabaseAchievement.reward,
        description: supabaseAchievement.description,
        metric: supabaseAchievement.metric,
        position: supabaseAchievement.position,
        required_count: supabaseAchievement.required_count,
      })
      .eq('id', achievement.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async remove(achievement: Achievement): Promise<void> {
    const { error } = await this.supabase
      .from('achievements')
      .delete()
      .eq('id', achievement.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
