import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/constants'
import { UsersFaker } from '@stardust/core/fakers/entities'
import type { UserDto } from '@stardust/core/global/dtos'
import type { IHttp, HttpSchema } from '@stardust/core/interfaces'
import { ApiResponse } from '@stardust/core/responses'

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
      return new ApiResponse({ statusCode: HTTP_STATUS_CODE.redirect })
    },

    setCookie(key, value, duration) {
      cookies.push({ key, value, duration })
    },

    getCookie(key: string) {
      throw new Error('NextHttp getCookie method not implemented')
    },

    getBody() {
      throw new Error('Method not implemented')
    },

    async getUser() {
      return fakeUser
    },

    pass() {
      return new ApiResponse({ headers: { [HTTP_HEADERS.xPass]: 'true' } })
    },

    send(body: unknown, statusCode: number) {
      return new ApiResponse({ body, statusCode })
    },
  }
}
