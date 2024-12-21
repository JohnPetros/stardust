import { IHttp, type Cookie } from '@stardust/core/interfaces'
import { ApiResponse } from '@stardust/core/responses'

type HttpMockProps = {
  fakeSearchParams?: Record<string, string>
  fakeRoute?: string
  fakeCookies?: Cookie[]
}

export const HttpMock = ({
  fakeRoute = '',
  fakeSearchParams = {},
  fakeCookies = [],
}: HttpMockProps = {}): IHttp => {
  const searchParams = fakeSearchParams
  const cookies: Cookie[] = fakeCookies

  return {
    getSearchParam(key: string) {
      return searchParams[key]
    },

    getCurrentRoute() {
      return fakeRoute
    },

    redirect(route: string) {
      return new ApiResponse(route, 303)
    },

    setCookie(cookie: Cookie) {
      cookies.push(cookie)
    },

    getCookie(key: string) {
      const cookie = cookies.find((cookie) => cookie.key === key)
      return cookie ?? null
    },

    getBody() {
      throw new Error('Method not implemented')
    },

    send(data: unknown, statusCode: number) {
      return new ApiResponse(data, statusCode)
    },
  }
}
