import { _setCookie } from '@/modules/global/actions'
import type { IController, IHttp } from '@/@core/interfaces/handlers'
import type { IRankingsService } from '@/@core/interfaces/services'
import { UpdateRankingsUseCase } from '@/@core/use-cases/rankings/UpdateRankingsUseCase'
import { HTTP_STATUS_CODE } from '@/@core/constants'

export const UpdateRakingsController = (
  rankingsService: IRankingsService
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
