import type { AchievementDTO } from '@/@core/dtos'
import type { IAchievementsService } from '@/@core/interfaces/services'
import { ServiceResponse } from '@/@core/responses'

export class AchievementsServiceMock implements IAchievementsService {
  private fakeAchievementsDTO: AchievementDTO[] = []

  async fetchAchievements(): Promise<ServiceResponse<AchievementDTO[]>> {
    return new ServiceResponse(this.fakeAchievementsDTO)
  }

  async saveUnlockedAchievement(
    achievementId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>> {
    return new ServiceResponse(true)
  }

  async saveRescuableAchievement(
    achievementId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>> {
    return new ServiceResponse(true)
  }

  async deleteRescuableAchievement(
    achievementId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>> {
    return new ServiceResponse(true)
  }
}
