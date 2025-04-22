import type { UserDto } from '../../../global/dtos'
import type { User } from '../../../global/domain/entities'
import type { AchievementDto } from '../../../profile/dtos'
import type { IProfileService } from '../../../global/interfaces'
import { ApiResponse } from '../../../global/responses'

export class ProfileServiceMock implements IProfileService {
  fakeAchievementsDto: AchievementDto[] = []
  fakeUsersDto: UserDto[] = []

  fetchUsers(): Promise<ApiResponse<UserDto[]>> {
    throw new Error('Method not implemented.')
  }

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

  async resetWeekStatus(): Promise<ApiResponse> {
    throw new Error('Method not implemented.')
  }

  saveUser(user: User): Promise<ApiResponse> {
    throw new Error('Method not implemented.')
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
