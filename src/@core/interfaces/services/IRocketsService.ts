import type { Rocket } from '@/@core/domain/entities'
import type { PaginationResponse, ServiceResponse } from '@/@core/responses'
import type { ShopItemsListingSettings } from '@/@core/types'

export interface IRocketsSerivice {
  getShopRocketsList(
    ListingSettings: ShopItemsListingSettings
  ): Promise<ServiceResponse<PaginationResponse<Rocket>>>
  getRocketById(rocketId: string): Promise<ServiceResponse<Rocket>>
  getUserAcquiredRocketsIds(userId: string): Promise<ServiceResponse<string[]>>
}
