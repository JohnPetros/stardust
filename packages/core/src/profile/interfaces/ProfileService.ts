import type { AchievementDto, UserDto } from '../domain/entities/dtos'
import type { User } from '../domain/entities'
import type { RestResponse } from '#global/responses/index'

export interface ProfileService {
  fetchAchievements(): Promise<RestResponse<AchievementDto[]>>
  fetchUnlockedAchievements(userId: string): Promise<RestResponse<AchievementDto[]>>
  fetchUsers(): Promise<RestResponse<UserDto[]>>
  resetWeekStatus(): Promise<RestResponse>
  saveUser(user: User): Promise<RestResponse>
  saveUnlockedAchievement(
    achievementId: string,
    userId: string,
  ): Promise<RestResponse<boolean>>
  saveRescuableAchievement(
    achievementId: string,
    userId: string,
  ): Promise<RestResponse<boolean>>
  deleteRescuableAchievement(
    achievementId: string,
    userId: string,
  ): Promise<RestResponse<boolean>>
  fetchUserById(userId: string): Promise<RestResponse<UserDto>>
  fetchUserBySlug(userSlug: string): Promise<RestResponse<UserDto>>
  fetchUserName(userName: string): Promise<RestResponse<string>>
  fetchUserEmail(userEmail: string): Promise<RestResponse<string>>
  updateUser(user: User): Promise<RestResponse<boolean>>
}
