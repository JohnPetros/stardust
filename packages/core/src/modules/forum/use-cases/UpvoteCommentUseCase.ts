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
}>

export class UpvoteCommentUseCase implements IUseCase<Request, Response> {
  constructor(private readonly forumService: IForumService) {}

  async do({ userDto, commentId }: Request) {
    const user = User.create(userDto)
    const comment = await this.fetchComment(commentId)
    const isCommentUpvoted = user.hasUpvotedComment(comment.id)

    if (isCommentUpvoted.isTrue) {
      comment.removeUpvote()
      const response = await this.forumService.deleteCommentUpvote(comment.id)
      if (response.isFailure) response.throwError()
    }

    if (isCommentUpvoted.isFalse) {
      comment.upvote()
      const response = await this.forumService.saveCommentUpvote(comment.id, user.id)
      if (response.isFailure) response.throwError()
    }

    return {
      upvotesCount: comment.upvotesCount.value,
    }
  }

  private async fetchComment(commentId: string) {
    const response = await this.forumService.fetchCommentById(commentId)
    if (response.isFailure) response.throwError()
    return Comment.create(response.body)
  }
}
