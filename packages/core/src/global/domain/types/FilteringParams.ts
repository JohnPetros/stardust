import type { Text } from '../structures'
import type { PaginationParams } from './PaginationParams'

export type FilteringParams = {
  search?: Text
} & PaginationParams
