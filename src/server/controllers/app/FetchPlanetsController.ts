import type { IController, IHttp } from '@/@core/interfaces/handlers'
import type { IPlanetsService } from '@/@core/interfaces/services'

export const FetchPlanetsController = (planetsService: IPlanetsService): IController => {
  return {
    async handle(http: IHttp) {
      const planetsResponse = await planetsService.fetchPlanets()

      if (planetsResponse.isFailure) {
        return http.send(planetsResponse.errorMessage, 500)
      }

      return http.send(planetsResponse.data, 200)
    },
  }
}
