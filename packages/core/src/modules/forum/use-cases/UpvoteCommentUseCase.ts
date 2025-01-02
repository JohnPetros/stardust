import type { UserDto } from '#global/dtos'
import { User } from '#global/entities'
import { Comment } from '#forum/entities'
import type { IForumService, IUseCase } from '#interfaces'

type Request = {
  userDto: UserDto
  commentId: string
}

type Response = Promise<{
  upvotesCount: number
  userUpvotedCommentsIds: string[]
}>

export class UpvoteCommentUseCase implements IUseCase<Request, Response> {
  constructor(private readonly forumService: IForumService) {}

  async do({ userDto, commentId }: Request) {
    const user = User.create(userDto)
    const comment = await this.fetchComment(commentId)
    const isCommentUpvoted = user.hasUpvotedComment(comment.id)

    if (isCommentUpvoted.isTrue) {
      user.removeUpvoteComment(comment)
      const response = await this.forumService.deleteCommentUpvote(comment.id, user.id)
      if (response.isFailure) response.throwError()
    }

    if (isCommentUpvoted.isFalse) {
      user.upvoteComment(comment)
      const response = await this.forumService.saveCommentUpvote(comment.id, user.id)
      if (response.isFailure) response.throwError()
    }

    return {
      upvotesCount: comment.upvotesCount.value,
      userUpvotedCommentsIds: user.upvotedCommentsIds.items,
    }
  }

  private async fetchComment(commentId: string) {
    const response = await this.forumService.fetchCommentById(commentId)
    if (response.isFailure) response.throwError()
    return Comment.create(response.body)
  }
}
