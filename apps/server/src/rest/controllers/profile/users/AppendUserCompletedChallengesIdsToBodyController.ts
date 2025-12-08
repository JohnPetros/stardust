import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { Id } from '@stardust/core/global/structures'

export class AppendUserCompletedChallengesIdsToBodyController implements Controller {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http) {
    const account = await http.getAccount()
    if (!account) return http.pass()
    const user = await this.usersRepository.findById(Id.create(account.id))
    if (!user) return http.pass()
    http.extendBody({ userCompletedChallengesIds: user.completedChallengesIds })
    return http.pass()
  }
}
