import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type {
  IController,
  IHttp,
  IRankingService,
} from '@stardust/core/global/interfaces'

export const FetchTiersController = (service: IRankingService): IController => {
  return {
    async handle(http: IHttp) {
      const response = await service.fetchTiers()
      const tiersDto = response.body
      return http.send(tiersDto, HTTP_STATUS_CODE.ok)
    },
  }
}
