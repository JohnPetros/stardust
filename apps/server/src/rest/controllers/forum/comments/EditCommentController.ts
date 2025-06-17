import type { CommentsRepository } from '@stardust/core/forum/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { EditCommentUseCase } from '@stardust/core/forum/use-cases'

type Schema = {
  routeParams: {
    commentId: string
  }
  body: {
    content: string
  }
}

export class EditCommentController implements Controller<Schema> {
  constructor(private readonly repository: CommentsRepository) {}

  async handle(http: Http<Schema>) {
    const { commentId } = http.getRouteParams()
    const { content } = await http.getBody()
    const useCase = new EditCommentUseCase(this.repository)
    const response = await useCase.execute({ commentId, content })
    return http.send(response)
  }
}
