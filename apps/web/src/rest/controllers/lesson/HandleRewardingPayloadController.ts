import type { Controller, Http } from '@stardust/core/global/interfaces'

import { COOKIES, ROUTES } from '@/constants'

export const HandleRewardingPayloadController = (): Controller => {
  return {
    async handle(http: Http) {
      const currentRoute = http.getCurrentRoute()
      const method = http.getMethod()

      if (method === 'GET' && currentRoute.startsWith('/rewarding')) {
        const hasRewardsPayloadCookie = await http.hasCookie(
          COOKIES.keys.rewardingPayload,
        )
        if (!hasRewardsPayloadCookie) return http.redirect(ROUTES.space)
      }

      return await http.pass()
    },
  }
}
