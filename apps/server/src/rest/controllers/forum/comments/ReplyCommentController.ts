import type { CommentDto } from '@stardust/core/forum/entities/dtos'
import type { CommentsRepository } from '@stardust/core/forum/interfaces'
import { ReplyCommentUseCase } from '@stardust/core/forum/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    commentId: string
  }
  body: {
    content: string
  }
}

export class ReplyCommentController implements Controller<Schema> {
  constructor(private readonly repository: CommentsRepository) {}

  async handle(http: Http<Schema>) {
    const { commentId } = http.getRouteParams()
    const { content } = await http.getBody()
    const account = await http.getAccount()
    const useCase = new ReplyCommentUseCase(this.repository)
    const response = await useCase.execute({
      commentId,
      replyDto: {
        content,
        author: {
          id: String(account.id),
        },
      },
    })
    return http.statusCreated().send(response)
  }
}
