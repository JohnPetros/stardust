import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ShopService } from '@stardust/core/shop/interfaces'

export const FetchShopItemsController = (shopService: ShopService): Controller => {
  return {
    async handle(http: Http) {
      const rocketsResponse = await shopService.fetchShopRocketsList({
        itemsPerPage: 5,
        page: 1,
        order: 'ascending',
      })
      if (rocketsResponse.isFailure) rocketsResponse.throwError()

      const avatarsResponse = await shopService.fetchShopAvatarsList({
        itemsPerPage: 5,
        page: 1,
        order: 'ascending',
      })
      if (avatarsResponse.isFailure) avatarsResponse.throwError()

      return http.sendJson(
        {
          rockets: {
            items: rocketsResponse.body.items,
            count: rocketsResponse.body.count,
          },
          avatars: {
            items: avatarsResponse.body.items,
            count: avatarsResponse.body.count,
          },
        },
        HTTP_STATUS_CODE.ok,
      )
    },
  }
}
