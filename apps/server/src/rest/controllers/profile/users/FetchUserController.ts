import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  routeParams: {
    userId?: string
    userSlug?: string
  }
}

export class FetchUserController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { userId, userSlug } = http.getRouteParams()
    const useCase = new GetUserUseCase(this.usersRepository)
    const user = await useCase.execute({ userId, userSlug })
    return http.send(user)
  }
}
