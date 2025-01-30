import type { IController, IHttp } from '@stardust/core/interfaces'

import { cookieActions } from '@/server/next-safe-action'
import { COOKIES, ROUTES } from '@/constants'

export const HandleRewardsPayloadController = (): IController => {
  return {
    async handle(http: IHttp) {
      const currentRoute = http.getCurrentRoute()

      if (currentRoute.startsWith('/rewarding')) {
        const hasRewardsPayloadCookie = (
          await cookieActions.hasCookie(COOKIES.keys.rewardingPayload)
        )?.data

        if (!hasRewardsPayloadCookie) return http.redirect(ROUTES.space)
      }

      return http.pass()
    },
  }
}
