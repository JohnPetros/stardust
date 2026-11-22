import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UserNotFoundError } from '@stardust/core/profile/errors'
import { Id } from '@stardust/core/global/structures'

export class AppendUserTrailFactsToBodyController implements Controller {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http) {
    const accountId = await http.getAccountId()
    const user = await this.usersRepository.findById(Id.create(accountId))
    if (!user) throw new UserNotFoundError()
    http.extendBody({
      completedStarsIds: user.completedStarsIds.dto,
      openedPlanetsIds: user.openedPlanetsIds.dto,
    })
    return http.pass()
  }
}
