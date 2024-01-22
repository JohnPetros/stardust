import type { Comment } from '@/@types/comment'
import type { Order } from '@/@types/order'

export interface ICommentsController {
  getFilteredComments(
    challengeId: string,
    sorter: 'date' | 'upvotes',
    order: Order
  ): Promise<Comment[]>
  getUserUpvotedCommentsIds(userId: string): Promise<string[]>
  getCommentReplies(commentId: string): Promise<Comment[]>
  postComment(
    comment: Omit<Comment, 'id' | 'user'>,
    userId: string
  ): Promise<void>
}
