import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import type { CommentDto } from '../domain/entities/dtos'
import type { CommentsRepository } from '../interfaces/CommentsRepository'
import { CommentNotFoundError } from '../domain/errors/CommentNotFoundError'

type Request = {
  commentId: string
}

type Response = Promise<CommentDto[]>

export class GetCommentRepliesUseCase implements UseCase<Request, Response> {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute({ commentId }: Request) {
    const comment = await this.commentsRepository.findById(Id.create(commentId))
    if (!comment) throw new CommentNotFoundError()
    const replies = await this.commentsRepository.findAllRepliesByComment(comment.id)
    return replies.map((reply) => reply.dto)
  }
}
