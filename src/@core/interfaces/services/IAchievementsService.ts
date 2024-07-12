import type { AchievementDTO } from '@/@core/dtos'
import type { ServiceResponse } from '@/@core/responses'

export interface IAchievementsService {
  fetchAchievements(): Promise<ServiceResponse<AchievementDTO[]>>
  saveUnlockedAchievement(
    achievementId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>>
  saveRescuableAchievement(
    achievementId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>>
  deleteRescuebleAchievement(
    achievementId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>>
}
