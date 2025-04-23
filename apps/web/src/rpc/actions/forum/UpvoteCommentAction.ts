import type { Action, Call, IForumService } from '@stardust/core/global/interfaces'
import { UpvoteCommentUseCase } from '@stardust/core/forum/use-cases'

type Request = {
  commentId: string
}

type Response = {
  upvotesCount: number
  userUpvotedCommentsIds: string[]
}

export const UpvoteCommentAction = (
  forumService: IForumService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const userDto = await call.getUser()
      const { commentId } = call.getRequest()
      const useCase = new UpvoteCommentUseCase(forumService)
      return await useCase.do({
        commentId,
        userDto,
      })
    },
  }
}
