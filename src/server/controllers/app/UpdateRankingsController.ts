import { _setCookie } from '@/modules/global/actions'
import type { IController, IHttp } from '@/@core/interfaces/handlers'
import type { IRankingsService } from '@/@core/interfaces/services'
import { UpdateRankingsUseCase } from '@/@core/use-cases/rankings/UpdateRankingsUseCase'

export const UpdateRakingsController = (
  rankingsService: IRankingsService
): IController => {
  return {
    async handle(http: IHttp) {
      const useCase = new UpdateRankingsUseCase(rankingsService)

      try {
        await useCase.do()
      } catch (error) {
        return http.send(error.message, 500)
      }

      return http.send(null, 200)
    },
  }
}
