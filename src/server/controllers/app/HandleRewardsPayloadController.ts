import { _hasCookie } from '@/modules/global/actions'
import type { IController, IHttp } from '@/@core/interfaces/handlers'
import { COOKIES, ROUTES } from '@/modules/global/constants'
import { HttpResponse } from '@/@core/responses'

export const HandleRewardsPayloadController = (): IController => {
  return {
    async handle(http: IHttp) {
      const currentRoute = http.getCurrentRoute()

      if (currentRoute === ROUTES.private.app.rewards) {
        const hasRewardsPayloadCookie = await _hasCookie(COOKIES.keys.rewardsPayload)

        if (!hasRewardsPayloadCookie) return http.redirect(ROUTES.private.app.home.space)
      }

      return new HttpResponse(null)
    },
  }
}
