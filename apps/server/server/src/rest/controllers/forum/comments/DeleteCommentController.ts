import type { CommentsRepository } from '@stardust/core/forum/interfaces'
import { DeleteCommentUseCase } from '@stardust/core/forum/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    commentId: string
  }
}

export class DeleteCommentController implements Controller<Schema> {
  constructor(private readonly repository: CommentsRepository) {}

  async handle(http: Http<Schema>) {
    const { commentId } = http.getRouteParams()
    const useCase = new DeleteCommentUseCase(this.repository)
    const response = await useCase.execute({ commentId })
    return http.send(response)
  }
}
