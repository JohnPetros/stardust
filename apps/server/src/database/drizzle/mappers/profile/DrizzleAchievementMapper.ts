import { Achievement } from '@stardust/core/profile/entities'
import type {
  DrizzleAchievement,
  DrizzleInsertAchievement,
} from '../../types/entities/profile'

export class DrizzleAchievementMapper {
  static toEntity(row: DrizzleAchievement): Achievement {
    return Achievement.create({
      ...DrizzleAchievementMapper.catalog(row),
      ...DrizzleAchievementMapper.requirements(row),
    })
  }
  static toPersistence(achievement: Achievement): DrizzleInsertAchievement {
    return achievement.dto
  }
  private static catalog(
    row: DrizzleAchievement,
  ): Pick<DrizzleAchievement, 'id' | 'name' | 'icon' | 'description'> {
    const { id, name, icon, description } = row
    return { id, name, icon, description }
  }
  private static requirements(
    row: DrizzleAchievement,
  ): Pick<DrizzleAchievement, 'metric' | 'requiredCount' | 'reward' | 'position'> {
    const { metric, requiredCount, reward, position } = row
    return { metric, requiredCount, reward, position }
  }
}
