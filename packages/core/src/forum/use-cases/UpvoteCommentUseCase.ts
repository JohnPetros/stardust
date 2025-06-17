import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'

type Request = {
  userId: string
  commentId: string
}

type Response = Promise<{
  userUpvotedCommentsIds: string[]
}>

export class UpvoteCommentUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(request: Request) {
    const user = await this.fetchUser(request.userId)
    const commentId = Id.create(request.commentId)
    const isCommentUpvoted = user.hasUpvotedComment(commentId)

    if (isCommentUpvoted.isTrue) {
      user.removeUpvoteComment(commentId)
      await this.repository.removeUpvotedComment(commentId, user.id)
    }

    if (isCommentUpvoted.isFalse) {
      user.upvoteComment(commentId)
      await this.repository.addUpvotedComment(commentId, user.id)
    }

    return {
      userUpvotedCommentsIds: user.upvotedCommentsIds.dto,
    }
  }

  private async fetchUser(userId: string) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()
    return user
  }
}
