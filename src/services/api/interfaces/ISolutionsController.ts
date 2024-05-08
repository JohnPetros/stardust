import { Order } from '../types/Order'

import type { Solution } from '@/@types/Solution'

export type GetFilteredSolutionsParams = {
  challengeId: string,
  title: string
  sorter: 'date' | 'upvotes',
}

export interface ISolutionsController {
  getFilteredSolutions(params: GetFilteredSolutionsParams): Promise<Solution[]>
  getUserUpvotedSolutionsIds(userId: string): Promise<string[]>
}
