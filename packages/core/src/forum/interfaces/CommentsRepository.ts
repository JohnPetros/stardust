import type { Id } from '#global/domain/structures/Id'
import type { Comment } from '../domain/entities/Comment'
import type { CommentsListParams } from '../domain/types'

export interface CommentsRepository {
  addByChallenge(comment: Comment, challengeId: Id): Promise<void>
  addBySolution(comment: Comment, solutionId: Id): Promise<void>
  addReply(reply: Comment, commentId: Id): Promise<void>
  findById(commentId: Id): Promise<Comment | null>
  findManyByChallenge(
    challengeId: Id,
    params: CommentsListParams,
  ): Promise<{ comments: Comment[]; totalCommentsCount: number }>
  findManyBySolution(
    solutionId: Id,
    params: CommentsListParams,
  ): Promise<{ comments: Comment[]; totalCommentsCount: number }>
  findAllRepliesByComment(commentId: Id): Promise<Comment[]>
  replace(comment: Comment): Promise<void>
  remove(commentId: Id): Promise<void>
}
