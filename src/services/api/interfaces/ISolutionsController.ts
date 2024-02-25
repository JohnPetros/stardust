import { Order } from '../types/Order'

import type { Solution } from '@/@types/Solution'

export type GetFilteredSolutionsParams = {
  challengeId: string,
  title: string
  sorter: 'date' | 'upvotes',
  order: Order
}

export interface ISolutionsController {
  getFilteredSolutions(params: GetFilteredSolutionsParams): Promise<Solution[]>
}
