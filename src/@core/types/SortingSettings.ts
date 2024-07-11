import type { ListingOrder } from './ListingOrder'

export type SortingSettings = {
  priceOrder: ListingOrder
  userId: string
  shouldFetchUnlocked: boolean | null
}
