import { NextResponse } from 'next/server'

import { IController, IHttp } from '@/@core/interfaces/handlers'

type Response = NextResponse | undefined

export const HandleRedirectController = (): IController<Response> => {
  return {
    async handle(http: IHttp<Response>) {
      const redirectRoute = http.getSearchParam('redirect_to')

      if (redirectRoute) return http.redirect(redirectRoute)
    },
  }
}
