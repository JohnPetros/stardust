import type { IController, IHttp } from '@stardust/core/interfaces'

import { COOKIES, ROUTES } from '@/constants'

export const HandleRewardsPayloadController = (): IController => {
  return {
    async handle(http: IHttp) {
      const currentRoute = http.getCurrentRoute()
      const method = http.getMethod()

      if (method === 'GET' && currentRoute.startsWith('/rewarding')) {
        const hasRewardsPayloadCookie = await http.hasCookie(
          COOKIES.keys.rewardingPayload,
        )
        if (!hasRewardsPayloadCookie) return http.redirect(ROUTES.space)
      }

      return http.pass()
    },
  }
}
