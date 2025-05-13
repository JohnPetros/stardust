import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { VerifyUserEmailInUseUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: {
    email: string
  }
}

export class VerifyUserEmailInUseController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { email } = await http.getBody()
    const useCase = new VerifyUserEmailInUseUseCase(this.usersRepository)
    await useCase.execute(email)
    return http.sendJson({})
  }
}
