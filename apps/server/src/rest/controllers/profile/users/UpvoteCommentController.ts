import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UpvoteCommentUseCase } from '@stardust/core/forum/use-cases'

type Schema = {
  routeParams: {
    commentId: string
  }
}

export class UpvoteCommentController implements Controller<Schema> {
  constructor(private readonly repository: UsersRepository) {}

  async handle(http: Http<Schema>) {
    const { commentId } = http.getRouteParams()
    const account = await http.getAccount()
    const useCase = new UpvoteCommentUseCase(this.repository)
    const response = await useCase.execute({ commentId, userId: String(account.id) })
    return http.send(response)
  }
}
