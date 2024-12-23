import type { UserDto } from '#global/dtos'
import type { User } from '#global/entities'
import type { AchievementDto } from '#profile/dtos'
import type { IProfileService } from '#interfaces'
import { ApiResponse } from '#responses'

export class ProfileServiceMock implements IProfileService {
  fakeAchievementsDto: AchievementDto[] = []
  fakeUsersDto: UserDto[] = []

  async fetchUserById(userId: string): Promise<ApiResponse<UserDto>> {
    const user = this.fakeUsersDto.find((fekeUser) => fekeUser.id === userId)

    if (!user) {
      return new ApiResponse<UserDto>()
    }

    return new ApiResponse({ body: user })
  }
  fetchUserBySlug(userSlug: string): Promise<ApiResponse<UserDto>> {
    throw new Error('Method not implemented.')
  }

  fetchUserName(userName: string): Promise<ApiResponse<string>> {
    throw new Error('Method not implemented.')
  }

  fetchUserEmail(userEmail: string): Promise<ApiResponse<string>> {
    throw new Error('Method not implemented.')
  }

  fetchUnlockedAchievements(userId: string): Promise<ApiResponse<AchievementDto[]>> {
    throw new Error('Method not implemented.')
  }

  async fetchAchievements(): Promise<ApiResponse<AchievementDto[]>> {
    return new ApiResponse({ body: this.fakeAchievementsDto })
  }

  async updateUser(user: User): Promise<ApiResponse<boolean>> {
    return new ApiResponse({ body: true })
  }

  async saveUnlockedAchievement(
    achievementId: string,
    userId: string,
  ): Promise<ApiResponse<boolean>> {
    return new ApiResponse({ body: true })
  }

  async saveRescuableAchievement(
    achievementId: string,
    userId: string,
  ): Promise<ApiResponse<boolean>> {
    return new ApiResponse({ body: true })
  }

  async deleteRescuableAchievement(
    achievementId: string,
    userId: string,
  ): Promise<ApiResponse<boolean>> {
    return new ApiResponse({ body: true })
  }
}
