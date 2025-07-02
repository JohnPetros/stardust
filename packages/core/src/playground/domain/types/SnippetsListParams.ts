import type { Id } from '#global/domain/structures/index'
import type { PaginationParams } from '../../../global/domain/types'

export type SnippetsListParams = {
  authorId: Id
} & PaginationParams
