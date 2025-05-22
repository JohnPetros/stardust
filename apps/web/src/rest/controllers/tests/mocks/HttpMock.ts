import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { MethodNotImplementedError } from '@stardust/core/global/errors'
import type { Http, HttpSchema } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

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
}: HttpMockProps<FakeSchema> = {}): Http<FakeSchema> => {
  let statusCode: number = HTTP_STATUS_CODE.ok
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
      return new RestResponse({
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

    async pass() {
      return new RestResponse({ headers: { [HTTP_HEADERS.xPass]: 'true' } })
    },

    statusOk() {
      statusCode = HTTP_STATUS_CODE.ok
      return this
    },

    statusCreated() {
      statusCode = HTTP_STATUS_CODE.created
      return this
    },

    send(body: unknown, statusCode: number) {
      return new RestResponse({ body, statusCode })
    },
  }
}
