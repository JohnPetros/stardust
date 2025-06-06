import type { ShopService as IShopService } from '@stardust/core/shop/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { ShopItemsListingParams } from '@stardust/core/shop/types'

export const ShopService = (restClient: RestClient): IShopService => {
  return {
    async fetchRocketsList({
      search,
      itemsPerPage,
      order,
      page,
    }: ShopItemsListingParams) {
      if (search) restClient.setQueryParam('search', search?.value)
      restClient.setQueryParam('order', order.value)
      restClient.setQueryParam('itemsPerPage', itemsPerPage.value.toString())
      restClient.setQueryParam('page', page.value.toString())
      return await restClient.get('/shop/rockets')
    },

    async fetchAvatarsList({
      search,
      itemsPerPage,
      order,
      page,
    }: ShopItemsListingParams) {
      if (search) restClient.setQueryParam('search', search?.value)
      restClient.setQueryParam('order', order.value)
      restClient.setQueryParam('itemsPerPage', itemsPerPage.value.toString())
      restClient.setQueryParam('page', page.value.toString())
      return await restClient.get('/shop/avatars')
    },
  }
}
