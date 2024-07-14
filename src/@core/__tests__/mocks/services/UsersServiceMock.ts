import type { User } from '@/@core/domain/entities'
import type { UserDTO } from '@/@core/dtos'
import type { IUsersService } from '@/@core/interfaces/services'
import { UserNotFoundError } from '@/@core/errors/users'
import { ServiceResponse } from '@/@core/responses'

export class UsersServiceMock implements IUsersService {
  private fakeUsersDTO: UserDTO[] = []

  async fetchUserById(userId: string): Promise<ServiceResponse<UserDTO>> {
    const user = this.fakeUsersDTO.find((fekeUser) => fekeUser.id === userId)

    if (!user) {
      return new ServiceResponse<UserDTO>(null, UserNotFoundError)
    }

    return new ServiceResponse(user)
  }
  fetchUserBySlug(userSlug: string): Promise<ServiceResponse<UserDTO>> {
    throw new Error('Method not implemented.')
  }
  fetchUserName(userName: string): Promise<ServiceResponse<string>> {
    throw new Error('Method not implemented.')
  }
  fetchUserEmail(userEmail: string): Promise<ServiceResponse<string>> {
    throw new Error('Method not implemented.')
  }
  updateUser(user: User): Promise<ServiceResponse<boolean>> {
    throw new Error('Method not implemented.')
  }
}
