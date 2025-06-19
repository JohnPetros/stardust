import type { CommentDto } from '@stardust/core/forum/entities/dtos'
import type { CommentsRepository } from '@stardust/core/forum/interfaces'
import { PostChallengeCommentUseCase } from '@stardust/core/forum/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
  body: {
    content: string
  }
}

export class PostChallengeCommentController implements Controller<Schema> {
  constructor(private readonly repository: CommentsRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const { content } = await http.getBody()
    const account = await http.getAccount()
    const useCase = new PostChallengeCommentUseCase(this.repository)
    const response = await useCase.execute({
      challengeId,
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
