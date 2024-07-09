import { IHttp, type Cookie } from '@/@core/interfaces/handlers/IHttp'
import { HttpResponse } from '@/@core/responses'

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
      return new HttpResponse(route, 303)
    },

    setCookie(cookie: Cookie) {
      cookies.push(cookie)
    },

    getCookie(key: string) {
      const cookie = cookies.find((cookie) => cookie.key === key)
      return cookie ?? null
    },

    send(data: unknown, statusCode: number) {
      return new HttpResponse(data, statusCode)
    },
  }
}
