import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { CommentNotFoundError } from '../domain/errors/CommentNotFoundError'
import type { CommentsRepository } from '../interfaces/CommentsRepository'

type Request = {
  commentId: string
}

export class DeleteCommentUseCase implements UseCase<Request> {
  constructor(private readonly repository: CommentsRepository) {}

  async execute({ commentId }: Request) {
    const comment = await this.repository.findById(Id.create(commentId))
    if (!comment) throw new CommentNotFoundError()

    await this.repository.remove(Id.create(commentId))
  }
}
