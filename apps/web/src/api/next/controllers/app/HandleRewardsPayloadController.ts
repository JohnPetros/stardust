import { _hasCookie } from '@/ui/global/actions'
import type { IController, IHttp } from '@/@core/interfaces/handlers'
import { COOKIES, ROUTES } from '@/ui/global/constants'
import { HttpResponse } from '@/@core/responses'

export const HandleRewardsPayloadController = (): IController => {
  return {
    async handle(http: IHttp) {
      const currentRoute = http.getCurrentRoute()

      if (currentRoute === ROUTES.private.app.rewarding) {
        const hasRewardsPayloadCookie = await _hasCookie(COOKIES.keys.rewardingPayload)

        if (!hasRewardsPayloadCookie) return http.redirect(ROUTES.private.app.home.space)
      }

      return new HttpResponse(null)
    },
  }
}
