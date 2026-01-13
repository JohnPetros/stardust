import type { ListingOrder } from '#global/domain/structures/ListingOrder'
import type { FilteringParams } from '#global/domain/types/FilteringParams'

export type ShopItemsListingParams = FilteringParams & {
  priceOrder: ListingOrder
}
