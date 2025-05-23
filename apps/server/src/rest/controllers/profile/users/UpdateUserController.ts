import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UpdateUserUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: UserDto
}

export class UpdateUserController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const userDto = await http.getBody()
    const useCase = new UpdateUserUseCase(this.usersRepository)
    const user = await useCase.execute(userDto)
    return http.send(user)
  }
}
