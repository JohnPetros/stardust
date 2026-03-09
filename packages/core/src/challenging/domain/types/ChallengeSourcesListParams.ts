import type { ListingOrder, Text } from '#global/domain/structures/index'
import type { PaginationParams } from '../../../global/domain/types'

export type ChallengeSourcesListParams = {
  title: Text
  positionOrder: ListingOrder
} & PaginationParams
