import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { IController, IHttp } from '@stardust/core/global/interfaces'
import type { IShopService } from '@stardust/core/global/interfaces'

export const FetchShopItemsController = (shopService: IShopService): IController => {
  return {
    async handle(http: IHttp) {
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

      return http.send(
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
