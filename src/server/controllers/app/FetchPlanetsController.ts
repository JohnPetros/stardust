import { HTTP_STATUS_CODE } from '@/@core/constants'
import type { IController, IHttp } from '@/@core/interfaces/handlers'
import type { ISpaceService } from '@/@core/interfaces/services'

export const FetchPlanetsController = (spaceService: ISpaceService): IController => {
  return {
    async handle(http: IHttp) {
      const response = await spaceService.fetchPlanets()

      if (response.isFailure) {
        return http.send(response.errorMessage, HTTP_STATUS_CODE.badRequest)
      }

      return http.send(response.data, HTTP_STATUS_CODE.ok)
    },
  }
}
