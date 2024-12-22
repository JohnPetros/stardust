import { _setCookie } from '@/ui/global/actions'
import type { IController, IHttp, IRankingService } from '@stardust/core/interfaces'
import { UpdateRankingsUseCase } from '@stardust/core/ranking/use-cases'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

export const UpdateRakingsController = (rankingService: IRankingService): IController => {
  return {
    async handle(http: IHttp) {
      const useCase = new UpdateRankingsUseCase(rankingService)
      await useCase.do()
      return http.send({ message: 'rankings are updated!' }, HTTP_STATUS_CODE.ok)
    },
  }
}
