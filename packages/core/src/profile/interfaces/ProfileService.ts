import type { RestResponse } from '#global/responses/index'
import type { Email, Id, Name, Slug } from '#global/domain/structures/index'
import type { AchievementDto, UserDto } from '../domain/entities/dtos'
import type { User } from '../domain/entities'

export interface ProfileService {
  fetchAchievements(): Promise<RestResponse<AchievementDto[]>>
  fetchUnlockedAchievements(userId: Id): Promise<RestResponse<AchievementDto[]>>
  observeNewUnlockedAchievements(userId: Id): Promise<RestResponse<AchievementDto[]>>
  rescueAchievement(achievementId: Id, userId: Id): Promise<RestResponse<UserDto>>
  fetchUserById(userId: Id): Promise<RestResponse<UserDto>>
  fetchUserBySlug(userSlug: Slug): Promise<RestResponse<UserDto>>
  verifyUserNameInUse(userName: Name): Promise<RestResponse>
  verifyUserEmailInUse(userEmail: Email): Promise<RestResponse>
  updateUser(user: User): Promise<RestResponse<boolean>>
}
