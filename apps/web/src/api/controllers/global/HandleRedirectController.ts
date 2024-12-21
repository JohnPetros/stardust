import type { IController, IHttp } from '@stardust/core/interfaces'
import { ApiResponse } from '@stardust/core/responses'

export const HandleRedirectController = (): IController => {
  return {
    async handle(http: IHttp) {
      const redirectRoute = http.getSearchParam('redirect_to')
      if (redirectRoute) return http.redirect(redirectRoute)

      return new ApiResponse()
    },
  }
}
