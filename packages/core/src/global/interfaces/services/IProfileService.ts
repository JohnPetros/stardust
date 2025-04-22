import type { User } from '../../domain/entities'
import type { UserDto } from '../../dtos'
import type { AchievementDto } from '../../../profile/dtos'
import type { ApiResponse } from '../../responses'

export interface IProfileService {
  fetchAchievements(): Promise<ApiResponse<AchievementDto[]>>
  fetchUnlockedAchievements(userId: string): Promise<ApiResponse<AchievementDto[]>>
  fetchUsers(): Promise<ApiResponse<UserDto[]>>
  resetWeekStatus(): Promise<ApiResponse>
  saveUser(user: User): Promise<ApiResponse>
  saveUnlockedAchievement(
    achievementId: string,
    userId: string,
  ): Promise<ApiResponse<boolean>>
  saveRescuableAchievement(
    achievementId: string,
    userId: string,
  ): Promise<ApiResponse<boolean>>
  deleteRescuableAchievement(
    achievementId: string,
    userId: string,
  ): Promise<ApiResponse<boolean>>
  fetchUserById(userId: string): Promise<ApiResponse<UserDto>>
  fetchUserBySlug(userSlug: string): Promise<ApiResponse<UserDto>>
  fetchUserName(userName: string): Promise<ApiResponse<string>>
  fetchUserEmail(userEmail: string): Promise<ApiResponse<string>>
  updateUser(user: User): Promise<ApiResponse<boolean>>
}
