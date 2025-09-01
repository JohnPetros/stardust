import type { Controller, Http } from '@stardust/core/global/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

export class AppendUserCompletedChallengesIdsToBodyController implements Controller {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http) {
    const account = await http.getAccount()
    const useCase = new GetUserUseCase(this.usersRepository)
    const user = await useCase.execute({
      userId: account.id,
      userAccountProvider: account.provider,
    })
    http.extendBody({ userCompletedChallengesIds: user.completedChallengesIds })
    return http.pass()
  }
}
