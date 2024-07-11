import type { User } from '@/@core/domain/entities'
import type { ServiceResponse } from '@/@core/responses'

export interface IUsersService {
  fetchUserById(userId: string): Promise<ServiceResponse<User>>
  fetchUserBySlug(userSlug: string): Promise<ServiceResponse<User>>
  fetchUserName(userName: string): Promise<ServiceResponse<string | null>>
  fetchUserEmail(userEmail: string): Promise<ServiceResponse<string | null>>
  fetchUserUnlockedStarsIds(userId: string): Promise<ServiceResponse<string[]>>
  saveUserAcquiredRocket(
    userId: string,
    rocketId: string
  ): Promise<ServiceResponse<boolean>>
  updateUser(user: User): Promise<ServiceResponse<boolean>>
}
