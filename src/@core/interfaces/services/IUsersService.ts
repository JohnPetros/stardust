import { User } from '@/@core/domain/entities'
import { ServiceResponse } from '@/@core/responses'

export interface IUsersService {
  getUserById(userId: string): Promise<ServiceResponse<User>>
  getUserBySlug(userSlug: string): Promise<ServiceResponse<User>>
  getUserName(userName: string): Promise<ServiceResponse<string | null>>
  getUserEmail(userEmail: string): Promise<ServiceResponse<string | null>>
  updateUser(user: User): Promise<ServiceResponse<boolean>>
}
