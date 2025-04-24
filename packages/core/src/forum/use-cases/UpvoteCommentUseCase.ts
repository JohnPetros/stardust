import type { UserDto } from '../../global/dtos'
import { User } from '../../global/domain/entities'
import { Comment } from '../domain/entities'
import type { IForumService, UseCase } from '../../global/interfaces'

type Request = {
  userDto: UserDto
  commentId: string
}

type Response = Promise<{
  upvotesCount: number
  userUpvotedCommentsIds: string[]
}>

export class UpvoteCommentUseCase implements UseCase<Request, Response> {
  constructor(private readonly forumService: IForumService) {}

  async do({ userDto, commentId }: Request) {
    const user = User.create(userDto)
    const comment = await this.fetchComment(commentId)
    const isCommentUpvoted = user.hasUpvotedComment(comment.id)

    if (isCommentUpvoted.isTrue) {
      user.removeUpvoteComment(comment.id)
      comment.removeUpvote()
      const response = await this.forumService.deleteCommentUpvote(
        comment.id.value,
        user.id.value,
      )
      if (response.isFailure) response.throwError()
    }

    if (isCommentUpvoted.isFalse) {
      user.upvoteComment(comment.id)
      comment.upvote()
      const response = await this.forumService.saveCommentUpvote(
        comment.id.value,
        user.id.value,
      )
      if (response.isFailure) response.throwError()
    }

    return {
      upvotesCount: comment.upvotesCount.value,
      userUpvotedCommentsIds: user.upvotedCommentsIds.items.map((id) => id.value),
    }
  }

  private async fetchComment(commentId: string) {
    const response = await this.forumService.fetchCommentById(commentId)
    if (response.isFailure) response.throwError()
    return Comment.create(response.body)
  }
}
