import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { Comment } from '../domain/entities/Comment'
import type { CommentDto } from '../domain/entities/dtos'
import type { CommentsRepository } from '../interfaces/CommentsRepository'

type Request = {
  commentDto: CommentDto
  challengeId: string
}

export class PostChallengeCommentUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: CommentsRepository) {}

  async execute({ commentDto, challengeId }: Request) {
    const comment = Comment.create(commentDto)
    await this.repository.addByChallenge(comment, Id.create(challengeId))
  }
}
