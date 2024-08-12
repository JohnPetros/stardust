import type { AchievementDTO } from '@/@core/dtos'
import type { SupabaseAchievement } from '../types'
import type { Achievement } from '@/@core/domain/entities'

export const SupabaseAchievementMapper = () => {
  return {
    toDTO(supabaseAchievement: SupabaseAchievement): AchievementDTO {
      const AchievementDTO: AchievementDTO = {
        id: supabaseAchievement.id,
        name: supabaseAchievement.name,
        icon: supabaseAchievement.icon,
        reward: supabaseAchievement.reward,
        description: supabaseAchievement.description,
        metric: supabaseAchievement.metric,
        position: supabaseAchievement.position,
        requiredCount: supabaseAchievement.required_count,
      }

      return AchievementDTO
    },

    toSupabase(achievement: Achievement): SupabaseAchievement {
      const achievementDTO = achievement.dto

      const supabaseAchievement: SupabaseAchievement = {
        id: achievement.id,
        name: achievementDTO.name,
        icon: achievementDTO.icon,
        reward: achievementDTO.reward,
        description: achievementDTO.description,
        metric: achievementDTO.metric,
        position: achievementDTO.position,
        required_count: achievementDTO.requiredCount,
      }

      return supabaseAchievement
    },
  }
}
