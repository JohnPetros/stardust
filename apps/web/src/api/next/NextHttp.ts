import { type NextRequest, NextResponse } from 'next/server'

import type { IHttp } from '@stardust/core/interfaces'
import { ApiResponse } from '@stardust/core/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

export const NextHttp = (request?: NextRequest): IHttp => {
  let nextRedirectResponse: NextResponse<unknown>

  return {
    getCurrentRoute() {
      return request ? `/${request.nextUrl.pathname.split('/')[1]}` : ''
    },

    redirect(route: string) {
      if (nextRedirectResponse) {
        return new ApiResponse({
          body: nextRedirectResponse,
          statusCode: HTTP_STATUS_CODE.redirect,
        })
      }

      const nextResponse = NextResponse.redirect(
        new URL(route, request ? request.url : ''),
      )
      return new ApiResponse({
        body: nextResponse,
        statusCode: HTTP_STATUS_CODE.redirect,
      })
    },

    getSearchParam(key: string) {
      return request ? new URL(request.url).searchParams.get(key) : ''
    },

    async getBody<Body>() {
      return (await request?.json()) as Body
    },

    setCookie(key: string, value: string, duration: number) {
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
        return new ApiResponse({
          body: nextRedirectResponse,
          statusCode: HTTP_STATUS_CODE.redirect,
        })
      }

      return new ApiResponse({
        body: NextResponse.json(data, { status: statusCode }),
        statusCode,
      })
    },
  }
}
