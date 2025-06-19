import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { Comment } from '../domain/entities/Comment'
import type { CommentDto } from '../domain/entities/dtos'
import type { CommentsRepository } from '../interfaces/CommentsRepository'

type Request = {
  commentDto: CommentDto
  solutionId: string
}

export class PostSolutionCommentUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: CommentsRepository) {}

  async execute({ commentDto, solutionId }: Request) {
    const comment = Comment.create(commentDto)
    await this.repository.addBySolution(comment, Id.create(solutionId))
  }
}
