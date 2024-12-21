import { _setCookie } from '@/ui/global/actions'
import type { IController, IHttp } from '@stardust/core/interfaces'
import type { IRankingsService } from '@stardust/core/interfaces'
import { UpdateRankingsUseCase } from '@/@core/use-cases/rankings/UpdateRankingsUseCase'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

export const UpdateRakingsController = (
  rankingsService: IRankingsService,
): IController => {
  return {
    async handle(http: IHttp) {
      const useCase = new UpdateRankingsUseCase(rankingsService)

      try {
        await useCase.do()
      } catch (error) {
        return http.send(error.message, HTTP_STATUS_CODE.serverError)
      }

      return http.send({ message: 'rankings are updated!' }, HTTP_STATUS_CODE.ok)
    },
  }
}
