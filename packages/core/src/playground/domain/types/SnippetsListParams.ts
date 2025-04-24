import type { PaginationParams } from '../../../global/domain/types'

export type SnippetsListParams = {
  authorId: string
} & PaginationParams
