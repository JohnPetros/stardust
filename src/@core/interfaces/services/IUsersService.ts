import { User } from '@/@core/domain/entities'
import { ServiceResponse } from '@/@core/responses'

export interface IUsersService {
  getUserById(userId: string): Promise<ServiceResponse<User>>
  getUserBySlug(userSlug: string): Promise<ServiceResponse<User>>
  updateUser(user: User): Promise<ServiceResponse<boolean>>
}
