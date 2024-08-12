import type { User } from '@/@core/domain/entities'
import type { UserDTO } from '@/@core/dtos'
import type { ServiceResponse } from '@/@core/responses'

export interface IUsersService {
  fetchUserById(userId: string): Promise<ServiceResponse<UserDTO>>
  fetchUserBySlug(userSlug: string): Promise<ServiceResponse<UserDTO>>
  fetchUserName(userName: string): Promise<ServiceResponse<string>>
  fetchUserEmail(userEmail: string): Promise<ServiceResponse<string>>
  updateUser(user: User): Promise<ServiceResponse<boolean>>
}
