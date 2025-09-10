import type { Controller, Http } from '@stardust/core/global/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

export class AppendUserInfoToBodyController implements Controller {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http) {
    const userId = await http.getAccountId()
    const useCase = new GetUserUseCase(this.usersRepository)
    const user = await useCase.execute({ userId })
    http.extendBody({
      userName: user.name,
      userSlug: user.slug,
    })
    return http.pass()
  }
}
