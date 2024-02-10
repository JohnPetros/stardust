import { IAchievementsController } from '../../interfaces/IAchievementsController'
import { SupabaseAchievementAdapter } from '../adapters/SupabaseAchievementAdapter'
import { Supabase } from '../types/Supabase'

export const SupabaseAchievementsController = (
  supabase: Supabase
): IAchievementsController => {
  return {
    getAchievements: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        throw new Error(error.message)
      }

      return data.map(SupabaseAchievementAdapter)
    },

    getUserUnlockedAchievementsIds: async (userId: string) => {
      const { data, error } = await supabase
        .from('users_unlocked_achievements')
        .select('achievement_id')
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return data.map((data) => data.achievement_id)
    },

    getUserRescuableAchievementsIds: async (userId: string) => {
      const { data, error } = await supabase
        .from('users_rescuable_achievements')
        .select('achievement_id')
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return data.map((data) => data.achievement_id)
    },

    addUserUnlockedAchievement: async (
      achievementId: string,
      userId: string
    ) => {
      const { error } = await supabase
        .from('users_unlocked_achievements')
        .insert([{ achievement_id: achievementId, user_id: userId }])

      if (error) {
        throw new Error(error.message)
      }
    },

    addUserRescuableAchievements: async (
      achievementId: string,
      userId: string
    ) => {
      const { error } = await supabase
        .from('users_rescuable_achievements')
        .insert([{ achievement_id: achievementId, user_id: userId }])

      if (error) {
        throw new Error(error.message)
      }
    },

    deleteUserRescuebleAchievement: async (
      achievementId: string,
      userId: string
    ) => {
      const { error } = await supabase
        .from('users_rescuable_achievements')
        .delete()
        .match({
          achievement_id: achievementId,
          user_id: userId,
        })

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
