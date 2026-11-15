import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'

export class AppendUserCurrentGalaxyToBodyController implements Controller {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http) {
    const userId = await http.getAccountId()
    const useCase = new GetUserUseCase(this.usersRepository)
    const user = await useCase.execute({ userId })
    http.extendBody({ storedGalaxyId: user.currentGalaxy?.id ?? null })
    return http.pass()
  }
}
