import type { PaginationResponse } from '#global/responses/PaginationResponse'
import type { RestResponse } from '#global/responses/RestResponse'
import type { ShopItemsListingParams } from '../domain/types'
import type { AvatarDto, InsigniaDto, RocketDto } from '../domain/entities/dtos'

export interface ShopService {
  fetchInsigniasList(): Promise<RestResponse<InsigniaDto[]>>
  fetchRocketsList(
    params: ShopItemsListingParams,
  ): Promise<RestResponse<PaginationResponse<RocketDto>>>
  fetchAvatarsList(
    params: ShopItemsListingParams,
  ): Promise<RestResponse<PaginationResponse<AvatarDto>>>
}
