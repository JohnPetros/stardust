import type { UserDto } from '../../global/dtos'
import type { User } from '../../global/domain/entities'
import type { AchievementDto } from '../../profile/dtos'
import type { ProfileService } from '../../global/interfaces'
import { RestResponse } from '../../global/responses'

export class ProfileServiceMock implements ProfileService {
  fakeAchievementsDto: AchievementDto[] = []
  fakeUsersDto: UserDto[] = []

  fetchUsers(): Promise<RestResponse<UserDto[]>> {
    throw new Error('Method not implemented.')
  }

  async fetchUserById(userId: string): Promise<RestResponse<UserDto>> {
    const user = this.fakeUsersDto.find((fekeUser) => fekeUser.id === userId)

    if (!user) {
      return new RestResponse<UserDto>()
    }

    return new RestResponse({ body: user })
  }
  fetchUserBySlug(userSlug: string): Promise<RestResponse<UserDto>> {
    throw new Error('Method not implemented.')
  }

  fetchUserName(userName: string): Promise<RestResponse<string>> {
    throw new Error('Method not implemented.')
  }

  fetchUserEmail(userEmail: string): Promise<RestResponse<string>> {
    throw new Error('Method not implemented.')
  }

  fetchUnlockedAchievements(userId: string): Promise<RestResponse<AchievementDto[]>> {
    throw new Error('Method not implemented.')
  }

  async fetchAchievements(): Promise<RestResponse<AchievementDto[]>> {
    return new RestResponse({ body: this.fakeAchievementsDto })
  }

  async resetWeekStatus(): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }

  saveUser(user: User): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }

  async updateUser(user: User): Promise<RestResponse<boolean>> {
    return new RestResponse({ body: true })
  }

  async saveUnlockedAchievement(
    achievementId: string,
    userId: string,
  ): Promise<RestResponse<boolean>> {
    return new RestResponse({ body: true })
  }

  async saveRescuableAchievement(
    achievementId: string,
    userId: string,
  ): Promise<RestResponse<boolean>> {
    return new RestResponse({ body: true })
  }

  async deleteRescuableAchievement(
    achievementId: string,
    userId: string,
  ): Promise<RestResponse<boolean>> {
    return new RestResponse({ body: true })
  }
}
