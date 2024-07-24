import type { IController, IHttp } from '@/@core/interfaces/handlers'
import { HttpResponse } from '@/@core/responses'

export const HandleRedirectController = (): IController => {
  return {
    async handle(http: IHttp) {
      const redirectRoute = http.getSearchParam('redirect_to')

      if (redirectRoute) return http.redirect(redirectRoute)

      return new HttpResponse(null)
    },
  }
}
