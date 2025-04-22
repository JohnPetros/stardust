import type { CommentDto } from '../../../forum/dtos'
import type { Comment } from '../../../forum/domain/entities'
import type { CommentsListParams } from '../../../forum/domain/types'
import type { ApiResponse, PaginationResponse } from '../../responses'

export interface IForumService {
  fetchCommentById(commentId: string): Promise<ApiResponse<CommentDto>>
  fetchChallengeCommentsList(
    params: CommentsListParams,
    challengeId: string,
  ): Promise<ApiResponse<PaginationResponse<CommentDto>>>
  fetchSolutionCommentsList(
    params: CommentsListParams,
    solutionId: string,
  ): Promise<ApiResponse<PaginationResponse<CommentDto>>>
  fetchCommentReplies(commentId: string): Promise<ApiResponse<CommentDto[]>>
  saveChallengeComment(comment: Comment, challengeId: string): Promise<ApiResponse>
  saveSolutionComment(comment: Comment, solutionId: string): Promise<ApiResponse>
  saveCommentReply(reply: Comment, commentId: string): Promise<ApiResponse>
  saveCommentUpvote(commentId: string, userId: string): Promise<ApiResponse>
  updateCommentContent(commentContent: string, commentId: string): Promise<ApiResponse>
  deleteComment(commentId: string): Promise<ApiResponse>
  deleteCommentUpvote(commentId: string, userId: string): Promise<ApiResponse>
}
