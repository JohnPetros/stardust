import type { ShopService as IShopService } from '@stardust/core/shop/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { ShopItemsListingParams } from '@stardust/core/shop/types'
import type { PaginationResponse } from '@stardust/core/global/responses'
import type { AvatarDto, InsigniaDto, RocketDto } from '@stardust/core/shop/entities/dtos'
import type { Id } from '@stardust/core/global/structures'
import type { Avatar, Insignia, Rocket } from '@stardust/core/shop/entities'

export const ShopService = (restClient: RestClient): IShopService => {
  return {
    async fetchInsigniasList() {
      return await restClient.get('/shop/insignias')
    },

    async createInsignia(insignia: Insignia) {
      return await restClient.post<InsigniaDto>('/shop/insignias', insignia.dto)
    },

    async updateInsignia(insignia: Insignia) {
      return await restClient.put<InsigniaDto>(
        `/shop/insignias/${insignia.id.value}`,
        insignia.dto,
      )
    },

    async deleteInsignia(insigniaId: Id) {
      return await restClient.delete(`/shop/insignias/${insigniaId.value}`)
    },

    async fetchRocketsList({
      search,
      page,
      itemsPerPage,
      order,
    }: ShopItemsListingParams) {
      restClient.setQueryParam('search', search?.value ?? '')
      restClient.setQueryParam('page', page.value.toString())
      restClient.setQueryParam('itemsPerPage', itemsPerPage.value.toString())
      restClient.setQueryParam('order', order.value)
      const response =
        await restClient.get<PaginationResponse<RocketDto>>('/shop/rockets')
      restClient.clearQueryParams()
      return response
    },

    async fetchAvatarsList({
      search,
      page,
      itemsPerPage,
      order,
    }: ShopItemsListingParams) {
      restClient.setQueryParam('search', search?.value ?? '')
      restClient.setQueryParam('page', page.value.toString())
      restClient.setQueryParam('itemsPerPage', itemsPerPage.value.toString())
      restClient.setQueryParam('order', order.value)
      const response =
        await restClient.get<PaginationResponse<AvatarDto>>('/shop/avatars')
      restClient.clearQueryParams()
      return response
    },

    async createRocket(rocket: Rocket) {
      return await restClient.post<RocketDto>('/shop/rockets', rocket.dto)
    },

    async updateRocket(rocket: Rocket) {
      return await restClient.put<RocketDto>(
        `/shop/rockets/${rocket.id.value}`,
        rocket.dto,
      )
    },

    async deleteRocket(rocketId: Id) {
      return await restClient.delete(`/shop/rockets/${rocketId.value}`)
    },

    async createAvatar(avatar: Avatar) {
      return await restClient.post<AvatarDto>('/shop/avatars', avatar.dto)
    },

    async updateAvatar(avatar: Avatar) {
      return await restClient.put<AvatarDto>(
        `/shop/avatars/${avatar.id.value}`,
        avatar.dto,
      )
    },

    async deleteAvatar(avatarId: Id) {
      return await restClient.delete(`/shop/avatars/${avatarId.value}`)
    },
  }
}
