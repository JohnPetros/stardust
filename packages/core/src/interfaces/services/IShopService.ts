import type { AvatarDto, RocketDto } from '#shop/dtos'
import type { ShopItemsListingSettings } from '#shop/types'
import type { PaginationResponse, ApiResponse } from '#responses'

export interface IShopService {
  fetchShopAvatarsList(
    ListingSettings: ShopItemsListingSettings,
  ): Promise<ApiResponse<PaginationResponse<AvatarDto>>>
  fetchAvatarById(avatarId: string): Promise<ApiResponse<AvatarDto>>
  fetchAcquirableRocketsByDefault(): Promise<ApiResponse<RocketDto[]>>
  fetchAcquirableAvatarsByDefault(): Promise<ApiResponse<AvatarDto[]>>
  saveAcquiredAvatar(avatarId: string, userId: string): Promise<ApiResponse<boolean>>
  fetchRocketById(rocketId: string): Promise<ApiResponse<RocketDto>>
  fetchShopRocketsList(
    ListingSettings: ShopItemsListingSettings,
  ): Promise<ApiResponse<PaginationResponse<RocketDto>>>
  saveAcquiredRocket(rocketId: string, userId: string): Promise<ApiResponse<boolean>>
}
