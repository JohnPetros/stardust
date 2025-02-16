import type { ISpaceService, IController, IHttp } from '@stardust/core/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

export const FetchPlanetsController = (spaceService: ISpaceService): IController => {
  return {
    async handle(http: IHttp) {
      const response = await spaceService.fetchPlanets()
      if (response.isFailure) response.throwError()
      return http.send(response.body, HTTP_STATUS_CODE.ok)
    },
  }
}
