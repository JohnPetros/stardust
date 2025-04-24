import type { AvatarDto, RocketDto } from '../../../shop/dtos'
import type { ShopItemsListingParams } from '../../../shop/domain/types'
import type { PaginationResponse, ApiResponse } from '../../responses'

export interface IShopService {
  fetchShopAvatarsList(
    params: ShopItemsListingParams,
  ): Promise<ApiResponse<PaginationResponse<AvatarDto>>>
  fetchAvatarById(avatarId: string): Promise<ApiResponse<AvatarDto>>
  fetchAcquirableRocketsByDefault(): Promise<ApiResponse<RocketDto[]>>
  fetchAcquirableAvatarsByDefault(): Promise<ApiResponse<AvatarDto[]>>
  saveAcquiredAvatar(avatarId: string, userId: string): Promise<ApiResponse<boolean>>
  fetchRocketById(rocketId: string): Promise<ApiResponse<RocketDto>>
  fetchShopRocketsList(
    params: ShopItemsListingParams,
  ): Promise<ApiResponse<PaginationResponse<RocketDto>>>
  saveAcquiredRocket(rocketId: string, userId: string): Promise<ApiResponse<boolean>>
}
