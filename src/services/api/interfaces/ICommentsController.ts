import type { Comment } from '@/@types/commnet'
import type { Order } from '@/@types/order'

export interface ICommentsController {
  getFilteredComments(
    challengeId: string,
    sorter: 'date' | 'upvotes',
    order: Order
  ): Promise<Comment[]>
}
