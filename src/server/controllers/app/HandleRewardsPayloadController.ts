import { IController, IHttp } from '@/@core/interfaces/handlers'
import { COOKIES, ROUTES } from '@/modules/global/constants'
import { _hasCookie } from '@/modules/global/actions'
import { NextResponse } from 'next/server'

type Response = NextResponse | undefined

export const HandleRewardsPayloadController = (): IController<Response> => {
  return {
    async handle(http: IHttp<Response>) {
      const currentRoute = http.getCurrentRoute()

      if (currentRoute === ROUTES.private.rewards) {
        const hasRewardsPayloadCookie = await _hasCookie(COOKIES.keys.rewardsPayload)

        if (!hasRewardsPayloadCookie) return http.redirect(ROUTES.private.home.space)
      }
    },
  }
}
