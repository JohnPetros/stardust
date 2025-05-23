import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { VerifyUserNameInUseUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: {
    name: string
  }
}

export class VerifyUserNameInUseController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { name } = await http.getBody()
    const useCase = new VerifyUserNameInUseUseCase(this.usersRepository)
    const updatedUser = await useCase.execute(name)
    return http.send(updatedUser)
  }
}
