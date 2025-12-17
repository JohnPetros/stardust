import type { PaginationResponse } from '#global/responses/PaginationResponse'
import type { RestResponse } from '#global/responses/RestResponse'
import type { Id } from '#global/domain/structures/Id'
import type { ShopItemsListingParams } from '../domain/types'
import type { AvatarDto, InsigniaDto, RocketDto } from '../domain/entities/dtos'
import type { Avatar, Insignia, Rocket } from '../domain/entities'

export interface ShopService {
  fetchInsigniasList(): Promise<RestResponse<InsigniaDto[]>>

  fetchRocketsList(
    params: ShopItemsListingParams,
  ): Promise<RestResponse<PaginationResponse<RocketDto>>>
  fetchAvatarsList(
    params: ShopItemsListingParams,
  ): Promise<RestResponse<PaginationResponse<AvatarDto>>>
  createInsignia(insignia: Insignia): Promise<RestResponse<InsigniaDto>>
  updateInsignia(insignia: Insignia): Promise<RestResponse<InsigniaDto>>
  deleteInsignia(insigniaId: Id): Promise<RestResponse>
  createRocket(rocket: Rocket): Promise<RestResponse<RocketDto>>
  updateRocket(rocket: Rocket): Promise<RestResponse<RocketDto>>
  deleteRocket(rocketId: Id): Promise<RestResponse>
  createAvatar(avatar: Avatar): Promise<RestResponse<AvatarDto>>
  updateAvatar(avatar: Avatar): Promise<RestResponse<AvatarDto>>
  deleteAvatar(avatarId: Id): Promise<RestResponse>
}
