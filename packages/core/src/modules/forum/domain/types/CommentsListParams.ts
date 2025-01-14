import type { PaginationParams, SortingParams } from '#global/types'
import type { CommentsListSorter } from './CommentsListSorter'

export type CommentsListParams = {
  sorter: CommentsListSorter
} & PaginationParams &
  SortingParams
