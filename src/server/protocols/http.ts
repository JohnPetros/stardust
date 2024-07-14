import { type NextRequest, NextResponse } from 'next/server'

import type { IHttp, Cookie } from '@/@core/interfaces/handlers/IHttp'
import { HttpResponse } from '@/@core/responses'

export const NextHttp = (request: NextRequest): IHttp => {
  let nextRedirectResponse: NextResponse<unknown>

  return {
    getCurrentRoute() {
      return `/${request.nextUrl.pathname.split('/')[1]}`
    },

    redirect(route: string) {
      if (nextRedirectResponse) {
        return new HttpResponse(nextRedirectResponse, 303)
      }

      const nextResponse = NextResponse.redirect(new URL(route, request.url))
      return new HttpResponse(nextResponse, 303)
    },

    getSearchParam(key: string) {
      return new URL(request.url).searchParams.get(key)
    },

    setCookie({ key, value, duration }: Cookie) {
      nextRedirectResponse.cookies.set(key, value, {
        path: '/',
        httpOnly: true,
        maxAge: duration,
      })
    },

    getCookie(key: string) {
      throw new Error('NextHttp getCookie method not implemented')
    },

    send(data: unknown, statusCode = 200) {
      if (nextRedirectResponse) {
        return new HttpResponse(nextRedirectResponse, statusCode)
      }

      return new HttpResponse(NextResponse.json(data, { status: statusCode }), statusCode)
    },
  }
}
