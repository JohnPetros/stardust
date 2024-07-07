import { IHttp, CookieConfig } from '@/@core/interfaces/handlers/IHttp'
import { NextRequest, NextResponse } from 'next/server'

export const NextHttp = (request: NextRequest): IHttp => {
  let redirectResponse: NextResponse<unknown>

  return {
    getCurrentRoute() {
      return `/${request.nextUrl.pathname.split('/')[1]}`
    },

    redirect(route: string) {
      if (redirectResponse) return redirectResponse
      return NextResponse.redirect(new URL(route, request.url))
    },

    getSearchParam(key: string) {
      return new URL(request.url).searchParams.get(key)
    },

    setCookie({ key, value, duration }: CookieConfig) {
      redirectResponse.cookies.set(key, value, {
        path: '/',
        httpOnly: true,
        maxAge: duration,
      })
    },

    send(data: unknown) {
      if (redirectResponse) return redirectResponse

      return NextResponse.json(data)
    },
  }
}
