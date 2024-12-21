import { _hasCookie } from '@/ui/global/actions'
import type { IController, IHttp } from '@stardust/core/interfaces'
import { COOKIES, ROUTES } from '@/constants'
import { ApiResponse } from '@stardust/core/responses'

export const HandleRewardsPayloadController = (): IController => {
  return {
    async handle(http: IHttp) {
      const currentRoute = http.getCurrentRoute()

      if (currentRoute === ROUTES.private.lesson.rewarding) {
        const hasRewardsPayloadCookie = await _hasCookie(COOKIES.keys.rewardingPayload)

        if (!hasRewardsPayloadCookie) return http.redirect(ROUTES.private.space)
      }

      return new ApiResponse()
    },
  }
}
