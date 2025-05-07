import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '#profile/domain/entities/dtos/UserDto'
import type { ForumService } from '../interfaces'
import { User } from '../../global/domain/entities'
import { Comment } from '../domain/entities'

type Request = {
  userDto: UserDto
  commentId: string
}

type Response = Promise<{
  upvotesCount: number
  userUpvotedCommentsIds: string[]
}>

export class UpvoteCommentUseCase implements UseCase<Request, Response> {
  constructor(private readonly forumService: ForumService) {}

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
      userUpvotedCommentsIds: user.upvotedCommentsIds.ids.map((id) => id.value),
    }
  }

  private async fetchComment(commentId: string) {
    const response = await this.forumService.fetchCommentById(commentId)
    if (response.isFailure) response.throwError()
    return Comment.create(response.body)
  }
}
