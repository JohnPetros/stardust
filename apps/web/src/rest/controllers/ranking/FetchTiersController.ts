import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RankingService } from '@stardust/core/ranking/interfaces'

export const FetchTiersController = (service: RankingService): Controller => {
  return {
    async handle(http: Http) {
      const response = await service.fetchTiers()
      const tiersDto = response.body
      return http.send(tiersDto, HTTP_STATUS_CODE.ok)
    },
  }
}
