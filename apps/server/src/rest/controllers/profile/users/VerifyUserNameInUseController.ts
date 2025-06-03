import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { VerifyUserNameInUseUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  queryParams: {
    name: string
  }
}

export class VerifyUserNameInUseController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { name } = http.getQueryParams()
    const useCase = new VerifyUserNameInUseUseCase(this.usersRepository)
    await useCase.execute(name)
    return http.send()
  }
}
