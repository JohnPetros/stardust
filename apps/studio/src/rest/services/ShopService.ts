import type { ShopService as IShopService } from '@stardust/core/shop/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { ShopItemsListingParams } from '@stardust/core/shop/types'
import type { PaginationResponse } from '@stardust/core/global/responses'
import type { AvatarDto, RocketDto } from '@stardust/core/shop/entities/dtos'

export const ShopService = (restClient: RestClient): IShopService => {
  return {
    async fetchInsigniasList() {
      return await restClient.get('/shop/insignias')
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

    async createRocket(rocket: RocketDto) {
      return await restClient.post<RocketDto>('/shop/rockets', rocket)
    },

    async createAvatar(avatar: AvatarDto) {
      return await restClient.post<AvatarDto>('/shop/avatars', avatar)
    },
  }
}
