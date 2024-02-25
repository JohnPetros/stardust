import { Order } from '../types/Order'

import type { Comment } from '@/@types/Comment'

export interface ICommentsController {
  getFilteredComments(
    challengeId: string,
    sorter: 'date' | 'upvotes',
    order: Order
  ): Promise<Comment[]>
  getUserUpvotedCommentsIds(userId: string): Promise<string[]>
  getCommentReplies(commentId: string): Promise<Comment[]>
  editComment(commentId: string, userSlug: string, newContent: string): Promise<void>
  deleteComment(commentId: string, userSlug: string): Promise<void>
  postComment(
    comment: Pick<Comment, 'content' | 'challengeId' | 'parentCommentId'>,
    userSlug: string
  ): Promise<void>
  addUpvotedComment(commentId: string, userSlug: string): Promise<void>
  removeUpvotedComment(commentId: string, userSlug: string): Promise<void>
}
