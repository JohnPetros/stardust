import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { UsersFaker } from '@stardust/core/fakers/entities'
import type { UserDto } from '@stardust/core/global/dtos'
import { MethodNotImplementedError } from '@stardust/core/global/errors'
import type { IHttp, HttpSchema } from '@stardust/core/global/interfaces'
import { ApiResponse } from '@stardust/core/global/responses'

type Cookie = {
  key: string
  value: string
  duration: number
}

type HttpMockProps<fakeSchema> = {
  fakeSchema?: fakeSchema
  fakeRoute?: string
  fakeCookies?: Cookie[]
  fakeUser?: UserDto
}

export const HttpMock = <FakeSchema extends HttpSchema>({
  fakeSchema,
  fakeRoute = '',
  fakeCookies = [],
  fakeUser = UsersFaker.fakeDto(),
}: HttpMockProps<FakeSchema> = {}): IHttp<FakeSchema> => {
  const cookies: Cookie[] = fakeCookies

  return {
    getQueryParams() {
      return fakeSchema?.queryParams
    },

    getRouteParams() {
      return fakeSchema?.routeParams
    },

    getCurrentRoute() {
      return fakeRoute
    },

    redirect(route: string) {
      return new ApiResponse({
        statusCode: HTTP_STATUS_CODE.redirect,
        headers: { [HTTP_HEADERS.location]: route },
      })
    },

    setCookie(key, value, duration) {
      cookies.push({ key, value, duration })
    },

    getCookie(key: string) {
      throw new MethodNotImplementedError('NextHttp.getCookie')
    },

    deleteCookie(key) {
      throw new MethodNotImplementedError('NextHttp.deleteCookie')
    },

    hasCookie(key) {
      throw new MethodNotImplementedError('NextHttp.hasCookie')
    },

    getBody() {
      throw new MethodNotImplementedError('NextHttp.getBody')
    },

    async getUser() {
      return fakeUser
    },

    getMethod() {
      throw new MethodNotImplementedError('NextHttp.getMethod')
    },

    pass() {
      return new ApiResponse({ headers: { [HTTP_HEADERS.xPass]: 'true' } })
    },

    send(body: unknown, statusCode: number) {
      return new ApiResponse({ body, statusCode })
    },
  }
}
