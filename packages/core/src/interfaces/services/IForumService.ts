import type { CommentDto, TopicDto } from '#forum/dtos'
import type { Comment, Topic } from '#forum/entities'
import type { CommentsListingParams, TopicCategory } from '#forum/types'
import type { ApiResponse, PaginationResponse } from '#responses'

export interface IForumService {
  fetchChallengeTopic(
    challengeSlug: string,
    topicCategory: TopicCategory,
  ): Promise<ApiResponse<TopicDto>>
  fetchCommentById(commentId: string): Promise<ApiResponse<CommentDto>>
  fetchComments(
    params: CommentsListingParams,
  ): Promise<ApiResponse<PaginationResponse<CommentDto>>>
  fetchCommentReplies(commentId: string): Promise<ApiResponse<CommentDto[]>>
  saveComment(comment: Comment, topic: Topic): Promise<ApiResponse>
  saveCommentUpvote(commentId: string, userId: string): Promise<ApiResponse>
  updateCommentContent(commentContent: string, commentId: string): Promise<ApiResponse>
  deleteComment(commentId: string): Promise<ApiResponse>
  deleteCommentUpvote(commentId: string): Promise<ApiResponse>
}
