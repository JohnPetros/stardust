import type { PaginationParams, SortingParams } from '#global/types'
import type { CommentsListingSorter } from './CommentsListingSorter'

export type CommentsListingParams = {
  sorter: CommentsListingSorter
} & PaginationParams &
  SortingParams
