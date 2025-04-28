import type { PaginationResponse, RestResponse } from '@/global/responses'
import type { CommentDto } from '../domain/entities/dtos'
import type { CommentsListParams } from '../domain/types'

export interface ForumService {
  fetchCommentById(commentId: string): Promise<RestResponse<CommentDto>>
  fetchChallengeCommentsList(
    params: CommentsListParams,
    challengeId: string,
  ): Promise<RestResponse<PaginationResponse<CommentDto>>>
  fetchSolutionCommentsList(
    params: CommentsListParams,
    solutionId: string,
  ): Promise<RestResponse<PaginationResponse<CommentDto>>>
  fetchCommentReplies(commentId: string): Promise<RestResponse<CommentDto[]>>
  saveChallengeComment(comment: Comment, challengeId: string): Promise<RestResponse>
  saveSolutionComment(comment: Comment, solutionId: string): Promise<RestResponse>
  saveCommentReply(reply: Comment, commentId: string): Promise<RestResponse>
  saveCommentUpvote(commentId: string, userId: string): Promise<RestResponse>
  updateCommentContent(commentContent: string, commentId: string): Promise<RestResponse>
  deleteComment(commentId: string): Promise<RestResponse>
  deleteCommentUpvote(commentId: string, userId: string): Promise<RestResponse>
}
