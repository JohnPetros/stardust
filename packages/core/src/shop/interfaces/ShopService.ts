import type { PaginationResponse, RestResponse } from '#global/responses'
import type { AvatarDto, RocketDto } from '#shop/dtos'
import type { ShopItemsListingParams } from '#shop/types'

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
