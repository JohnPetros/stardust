import type { Id, Text } from '#global/domain/structures/index'
import type { PaginationResponse, RestResponse } from '#global/responses/index'
import type { CommentDto } from '../domain/entities/dtos'
import type { CommentsListParams } from '../domain/types'
import type { Comment } from '../domain/entities'

export interface ForumService {
  fetchChallengeCommentsList(
    params: CommentsListParams,
    challengeId: Id,
  ): Promise<RestResponse<PaginationResponse<CommentDto>>>
  fetchSolutionCommentsList(
    params: CommentsListParams,
    solutionId: Id,
  ): Promise<RestResponse<PaginationResponse<CommentDto>>>
  fetchCommentReplies(commentId: Id): Promise<RestResponse<CommentDto[]>>
  postChallengeComment(comment: Comment, challengeId: Id): Promise<RestResponse>
  postSolutionComment(comment: Comment, solutionId: Id): Promise<RestResponse>
  replyComment(reply: Comment, commentId: Id): Promise<RestResponse>
  editComment(commentContent: Text, commentId: Id): Promise<RestResponse>
  deleteComment(commentId: Id): Promise<RestResponse>
}
