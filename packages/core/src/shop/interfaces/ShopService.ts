import type { PaginationResponse } from '#global/responses/PaginationResponse'
import type { RestResponse } from '#global/responses/RestResponse'
import type { ShopItemsListingParams } from '../domain/types'
import type { AvatarDto, RocketDto } from '../dtos'

export interface ShopService {
  fetchShopAvatarsList(
    params: ShopItemsListingParams,
  ): Promise<RestResponse<PaginationResponse<AvatarDto>>>
  fetchAvatarById(avatarId: string): Promise<RestResponse<AvatarDto>>
  fetchAcquirableRocketsByDefault(): Promise<RestResponse<RocketDto[]>>
  fetchAcquirableAvatarsByDefault(): Promise<RestResponse<AvatarDto[]>>
  saveAcquiredAvatar(avatarId: string, userId: string): Promise<RestResponse<boolean>>
  fetchRocketById(rocketId: string): Promise<RestResponse<RocketDto>>
  fetchShopRocketsList(
    params: ShopItemsListingParams,
  ): Promise<RestResponse<PaginationResponse<RocketDto>>>
  saveAcquiredRocket(rocketId: string, userId: string): Promise<RestResponse<boolean>>
}
