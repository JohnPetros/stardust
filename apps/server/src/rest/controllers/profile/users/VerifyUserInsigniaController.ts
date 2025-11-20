import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { InsigniaRole } from '@stardust/core/global/structures'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'
import { InsigniaNotIncludedError } from '@stardust/core/profile/errors'

export class VerifyUserInsigniaController implements Controller {
  constructor(
    private readonly insigniaRole: InsigniaRole,
    private readonly repository: UsersRepository,
  ) {}

  async handle(http: Http): Promise<RestResponse> {
    const account = await http.getAccount()
    const useCase = new GetUserUseCase(this.repository)
    const user = await useCase.execute({ userId: account.id })

    if (user.insigniaRoles?.includes(this.insigniaRole.value)) {
      throw new InsigniaNotIncludedError()
    }

    return http.pass()
  }
}
