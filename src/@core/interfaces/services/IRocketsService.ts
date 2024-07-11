import type { RocketDTO } from '@/@core/dtos'
import type { PaginationResponse, ServiceResponse } from '@/@core/responses'
import type { ShopItemsListingSettings } from '@/@core/types'

export interface IRocketsSerivice {
  fetchRocketById(rocketId: string): Promise<ServiceResponse<RocketDTO>>
  fetchShopRocketsList(
    ListingSettings: ShopItemsListingSettings
  ): Promise<ServiceResponse<PaginationResponse<RocketDTO>>>
}
