import type { UserDTO } from '@/@core/dtos'
import type { ServiceResponse } from '@/@core/responses'

export interface IUsersService {
  fetchUserById(userId: string): Promise<ServiceResponse<UserDTO>>
  fetchUserBySlug(userSlug: string): Promise<ServiceResponse<UserDTO>>
  fetchUserName(userName: string): Promise<ServiceResponse<string>>
  fetchUserEmail(userEmail: string): Promise<ServiceResponse<string>>
  fetchUserUnlockedStarsIds(userId: string): Promise<ServiceResponse<string[]>>
  fetchUserAcquiredRocketsIds(userId: string): Promise<ServiceResponse<string[]>>
  fetchUserAcquiredAvatarsIds(userId: string): Promise<ServiceResponse<string[]>>
  fetchUserUnlockedAchievementsIds(userId: string): Promise<ServiceResponse<string[]>>
  fetchUserRescuableAchievementsIds(userId: string): Promise<ServiceResponse<string[]>>
  updateUser(user: UserDTO): Promise<ServiceResponse<boolean>>
}
