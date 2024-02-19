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
  editComment(commentId: string, userId: string, content: string): Promise<void>
  deleteComment(commentId: string, userId: string): Promise<void>
  postComment(
    comment: Pick<Comment, 'content' | 'challengeId' | 'parentCommentId'>,
    userSlug: string
  ): Promise<void>
  addUpvotedComment(commentId: string, userId: string): Promise<void>
  removeUpvotedComment(commentId: string, userId: string): Promise<void>
}
