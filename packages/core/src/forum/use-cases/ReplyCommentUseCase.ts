import { Id } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { Comment } from '../domain/entities'
import type { CommentDto } from '../domain/entities/dtos'
import { CommentNotFoundError } from '../domain/errors/CommentNotFoundError'
import type { CommentsRepository } from '../interfaces/CommentsRepository'

type Request = {
  commentId: string
  replyDto: CommentDto
}

export class ReplyCommentUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: CommentsRepository) {}

  async execute({ commentId, replyDto }: Request) {
    const comment = await this.repository.findById(Id.create(commentId))
    if (!comment) throw new CommentNotFoundError()
    const reply = Comment.create(replyDto)
    await this.repository.addReply(reply, comment.id)
  }
}
