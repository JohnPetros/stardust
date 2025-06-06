import type { Text, Id } from '@stardust/core/global/structures'
import type { PaginationParams } from '../../../global/domain/types'
import type { SolutionsListingSorter } from '../structures/SolutionsListingSorter'

export type SolutionsListingParams = {
  title: Text
  sorter: SolutionsListingSorter
  challengeId: Id | null
  userId: Id | null
} & PaginationParams
