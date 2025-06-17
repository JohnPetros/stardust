import { Id, Text } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { CommentNotFoundError } from '../domain/errors/CommentNotFoundError'
import type { CommentsRepository } from '../interfaces/CommentsRepository'

type Request = {
  commentId: string
  content: string
}

export class EditCommentUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: CommentsRepository) {}

  async execute({ commentId, content }: Request) {
    const comment = await this.repository.findById(Id.create(commentId))
    if (!comment) throw new CommentNotFoundError()
    comment.content = Text.create(content)
    await this.repository.replace(comment)
  }
}
