import type {
  IAction,
  IActionServer,
  IForumService,
} from '@stardust/core/global/interfaces'
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
): IAction<Request, Response> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const userDto = await actionServer.getUser()
      const { commentId } = actionServer.getRequest()
      const useCase = new UpvoteCommentUseCase(forumService)
      return await useCase.do({
        commentId,
        userDto,
      })
    },
  }
}
