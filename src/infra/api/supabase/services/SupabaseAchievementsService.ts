import type { IAchievementsService } from '@/@core/interfaces/services'
import type { Supabase } from '../types'
import { SupabasePostgrestError } from '../errors'
import {
  DeleteRescuableAchievementUnexpectedError,
  FetchAchievementsUnexpectedError,
  SaveRescuableAchievementUnexpectedError,
  SaveUnlockedAchievementUnexpectedError,
} from '@/@core/errors/achievements'
import { SupabaseAchievementMapper } from '../mappers'
import { ServiceResponse } from '@/@core/responses'

export const SupabaseAchievementsService = (supabase: Supabase): IAchievementsService => {
  const supabaseAchievementMapper = SupabaseAchievementMapper()

  return {
    async fetchAchievements() {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(error, FetchAchievementsUnexpectedError)
      }

      const achievements = data.map(supabaseAchievementMapper.toDTO)

      return new ServiceResponse(achievements)
    },

    async saveUnlockedAchievement(achievementId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_achievements')
        .insert({ achievement_id: achievementId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, SaveUnlockedAchievementUnexpectedError)
      }

      return new ServiceResponse(true)
    },

    async saveRescuableAchievement(achievementId: string, userId: string) {
      const { error } = await supabase
        .from('users_rescuable_achievements')
        .insert({ achievement_id: achievementId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, SaveRescuableAchievementUnexpectedError)
      }

      return new ServiceResponse(true)
    },

    async deleteRescuebleAchievement(achievementId: string, userId: string) {
      const { error } = await supabase
        .from('users_rescuable_achievements')
        .delete()
        .match({
          achievement_id: achievementId,
          user_id: userId,
        })

      if (error) {
        return SupabasePostgrestError(error, DeleteRescuableAchievementUnexpectedError)
      }

      return new ServiceResponse(true)
    },
  }
}
