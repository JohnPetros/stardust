import type { Controller, Http } from '@stardust/core/global/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

type Schema = {
  routeParams: {
    solutionId: string
  }
}

export class AppendIsSolutionUpvotedToBodyController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>) {
    const { solutionId } = http.getRouteParams()
    const userId = await http.getAccountId()
    const useCase = new GetUserUseCase(this.usersRepository)
    const user = await useCase.execute({ userId })
    http.extendBody({
      isSolutionUpvoted: Boolean(user.upvotedSolutionsIds?.includes(solutionId)),
    })
    return http.pass()
  }
}
