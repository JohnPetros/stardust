import type { AvatarDTO } from '@/@core/dtos'
import type { PaginationResponse, ServiceResponse } from '@/@core/responses'
import type { ShopItemsListingSettings } from '@/@core/types'

export interface IAvatarsService {
  fetchShopAvatarsList(
    ListingSettings: ShopItemsListingSettings
  ): Promise<ServiceResponse<PaginationResponse<AvatarDTO>>>
  fetchAvatarById(avatarId: string): Promise<ServiceResponse<AvatarDTO>>
  saveAcquiredAvatar(avatarId: string, userId: string): Promise<ServiceResponse<boolean>>
}
