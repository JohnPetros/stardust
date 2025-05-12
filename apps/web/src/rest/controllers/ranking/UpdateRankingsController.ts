import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RankingService } from '@stardust/core/ranking/interfaces'
import { UpdateRankingsUseCase } from '@stardust/core/ranking/use-cases'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

export const UpdateRakingsController = (rankingService: RankingService): Controller => {
  return {
    async handle(http: Http) {
      const useCase = new UpdateRankingsUseCase(rankingService)
      await useCase.do()
      return http.sendJson({ message: 'rankings are updated!' }, HTTP_STATUS_CODE.ok)
    },
  }
}
