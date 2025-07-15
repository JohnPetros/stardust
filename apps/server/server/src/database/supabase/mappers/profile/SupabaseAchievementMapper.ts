import type { AchievementDto } from '@stardust/core/profile/entities/dtos'
import type { SupabaseAchievement } from '../../types'
import { Achievement } from '@stardust/core/profile/entities'

export class SupabaseAchievementMapper {
  static toEntity(supabaseAchievement: SupabaseAchievement): Achievement {
    return Achievement.create(SupabaseAchievementMapper.toDto(supabaseAchievement))
  }

  static toDto(supabaseAchievement: SupabaseAchievement): AchievementDto {
    const achievementDto: AchievementDto = {
      id: supabaseAchievement.id,
      name: supabaseAchievement.name,
      icon: supabaseAchievement.icon,
      reward: supabaseAchievement.reward,
      description: supabaseAchievement.description,
      metric: supabaseAchievement.metric,
      position: supabaseAchievement.position,
      requiredCount: supabaseAchievement.required_count,
    }

    return achievementDto
  }

  static toSupabase(achievement: Achievement): SupabaseAchievement {
    const achievementDto = achievement.dto

    const supabaseAchievement: SupabaseAchievement = {
      id: achievement.id.value,
      name: achievementDto.name,
      icon: achievementDto.icon,
      reward: achievementDto.reward,
      description: achievementDto.description,
      metric: achievementDto.metric,
      position: achievementDto.position,
      required_count: achievementDto.requiredCount,
    }

    return supabaseAchievement
  }
}
