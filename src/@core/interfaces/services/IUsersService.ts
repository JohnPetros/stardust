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
  saveUserAcquiredAvatar(
    avatarId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>>
  saveUserAcquiredRocket(
    userId: string,
    rocketId: string
  ): Promise<ServiceResponse<boolean>>
  saveUserAcquiredAvatar(
    avatarId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>>
  saveUserUnlockedStar(starId: string, userId: string): Promise<ServiceResponse<boolean>>
  updateUser(user: UserDTO): Promise<ServiceResponse<boolean>>
}
