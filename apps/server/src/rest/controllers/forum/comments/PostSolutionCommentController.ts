import type { CommentDto } from '@stardust/core/forum/entities/dtos'
import type { CommentsRepository } from '@stardust/core/forum/interfaces'
import { PostSolutionCommentUseCase } from '@stardust/core/forum/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    solutionId: string
  }
  body: {
    content: string
  }
}

export class PostSolutionCommentController implements Controller<Schema> {
  constructor(private readonly repository: CommentsRepository) {}

  async handle(http: Http<Schema>) {
    const { solutionId } = http.getRouteParams()
    const { content } = await http.getBody()
    const account = await http.getAccount()
    const useCase = new PostSolutionCommentUseCase(this.repository)
    const response = await useCase.execute({
      solutionId,
      commentDto: {
        content,
        author: {
          id: String(account.id),
        },
      },
    })
    return http.statusCreated().send(response)
  }
}
