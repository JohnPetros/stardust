import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UpdateUserUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  routeParams: {
    userId: string
  }
  body: UserDto
}

export class UpdateUserController implements Controller<Schema> {
  constructor(private readonly repository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { userId } = http.getRouteParams()
    const user = await http.getBody()
    const useCase = new UpdateUserUseCase(this.repository)
    const response = await useCase.execute({
      ...user,
      id: userId,
    })
    return http.send(response)
  }
}
