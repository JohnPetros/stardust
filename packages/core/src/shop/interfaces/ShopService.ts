import type { PaginationResponse } from '#global/responses/PaginationResponse'
import type { RestResponse } from '#global/responses/RestResponse'
import type { Id } from '#global/domain/structures/Id'
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
  createRocket(rocket: RocketDto): Promise<RestResponse<RocketDto>>
  updateRocket(rocket: RocketDto): Promise<RestResponse<RocketDto>>
  deleteRocket(rocketId: Id): Promise<RestResponse>
  createAvatar(avatar: AvatarDto): Promise<RestResponse<AvatarDto>>
  updateAvatar(avatar: AvatarDto): Promise<RestResponse<AvatarDto>>
  deleteAvatar(avatarId: Id): Promise<RestResponse>
}
