import type { AvatarDto, RocketDto } from '#dtos'
import type { PaginationResponse, ServiceResponse } from '../../responses'
import type { ShopItemsListingSettings } from '../../types'

export interface IShopService {
  fetchShopAvatarsList(
    ListingSettings: ShopItemsListingSettings,
  ): Promise<ServiceResponse<PaginationResponse<AvatarDto>>>
  fetchAvatarById(avatarId: string): Promise<ServiceResponse<AvatarDto>>
  saveAcquiredAvatar(avatarId: string, userId: string): Promise<ServiceResponse<boolean>>
  fetchRocketById(rocketId: string): Promise<ServiceResponse<RocketDto>>
  fetchShopRocketsList(
    ListingSettings: ShopItemsListingSettings,
  ): Promise<ServiceResponse<PaginationResponse<RocketDto>>>
  saveAcquiredRocket(rocketId: string, userId: string): Promise<ServiceResponse<boolean>>
}
