import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { InsigniaRole } from '@stardust/core/global/structures'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { VerifyUserInsigniaUseCase } from '@stardust/core/profile/use-cases'

export class VerifyUserInsigniaController implements Controller {
  constructor(
    private readonly insigniaRole: InsigniaRole,
    private readonly repository: UsersRepository,
  ) {}

  async handle(http: Http): Promise<RestResponse> {
    const account = await http.getAccount()
    const useCase = new VerifyUserInsigniaUseCase(this.repository)
    await useCase.execute({
      userId: account.id as string,
      insigniaRole: this.insigniaRole.value,
    })
    return http.pass()
  }
}
