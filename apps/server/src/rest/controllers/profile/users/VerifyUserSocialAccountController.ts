import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { VerifyUserSocialAccountUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: {
    id: string
    name: string
    email: string
    provider: string
  }
}

export class VerifyUserSocialAccountController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const userSocialAccount = await http.getBody()
    const useCase = new VerifyUserSocialAccountUseCase(this.usersRepository)
    const { deduplicatedUserName } = await useCase.execute({
      socialAccountId: userSocialAccount.id,
      socialAccountName: userSocialAccount.name,
      socialAccountEmail: userSocialAccount.email,
      socialAccountProvider: userSocialAccount.provider,
    })

    http.setBody({
      ...userSocialAccount,
      name: deduplicatedUserName,
    })

    return http.pass()
  }
}
