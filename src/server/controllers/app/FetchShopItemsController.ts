import { HTTP_STATUS_CODE } from '@/@core/constants'
import type { IController, IHttp } from '@/@core/interfaces/handlers'
import type { IAvatarsService, IRocketsSerivice } from '@/@core/interfaces/services'

export const FetchShopItemsController = (
  rocketsService: IRocketsSerivice,
  avatarsService: IAvatarsService,
): IController => {
  return {
    async handle(http: IHttp) {
      const rocketsResponse = await rocketsService.fetchShopRocketsList({
        limit: 5,
        offset: 0,
        order: 'ascending',
      })

      if (rocketsResponse.isFailure) {
        return http.send(rocketsResponse.errorMessage, HTTP_STATUS_CODE.serverError)
      }

      const avatarsResponse = await avatarsService.fetchShopAvatarsList({
        limit: 5,
        offset: 0,
        order: 'ascending',
      })

      if (avatarsResponse.isFailure) {
        return http.send(avatarsResponse.errorMessage, HTTP_STATUS_CODE.serverError)
      }

      return http.send(
        {
          rockets: {
            items: rocketsResponse.data.items,
            count: rocketsResponse.data.count,
          },
          avatars: {
            items: avatarsResponse.data.items,
            count: avatarsResponse.data.count,
          },
        },
        HTTP_STATUS_CODE.ok,
      )
    },
  }
}
