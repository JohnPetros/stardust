import type { SpaceService } from '@stardust/core/space/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

export const FetchPlanetsController = (spaceService: SpaceService): Controller => {
  return {
    async handle(http: Http) {
      const response = await spaceService.fetchPlanets()
      if (response.isFailure) response.throwError()
      return http.send(response.body, HTTP_STATUS_CODE.ok)
    },
  }
}
