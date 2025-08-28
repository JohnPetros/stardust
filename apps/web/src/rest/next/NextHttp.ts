import { type NextRequest, NextResponse } from 'next/server'
import type { ZodSchema } from 'zod'

import type { Http, HttpMethod, HttpSchema } from '@stardust/core/global/interfaces'
import { type PaginationResponse, RestResponse } from '@stardust/core/global/responses'
import { AppError, MethodNotImplementedError } from '@stardust/core/global/errors'
import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { CLIENT_ENV } from '@/constants'
import type { NextParams } from '@/rpc/next/types'
import { cookieActions } from '@/rpc/next-safe-action'

type Cookie = {
  key: string
  value: string
  duration: number
}

type NextHttpParams = {
  request?: NextRequest
  schema?: ZodSchema
  params?: NextParams
}

export const NextHttp = async <NextSchema extends HttpSchema>({
  request,
  schema,
  params,
}: NextHttpParams = {}): Promise<Http<NextSchema, NextResponse<unknown>>> => {
  let httpSchema: NextSchema
  const cookies: Cookie[] = []
  let statusCode: (typeof HTTP_STATUS_CODE)[keyof typeof HTTP_STATUS_CODE] =
    HTTP_STATUS_CODE.ok
  let extendedBody = {}

  if (request && schema) {
    let body: HttpSchema['body']
    let queryParams: HttpSchema['queryParams']
    let routeParams: HttpSchema['routeParams']

    // @ts-ignore
    const keys = schema.keyof().options

    if (keys.includes('queryParams')) {
      queryParams = Object.fromEntries(request.nextUrl.searchParams.entries())
    }

    if (keys.includes('body')) {
      body = await request?.json()
    }

    if (keys.includes('routeParams')) {
      if (!params) throw new AppError('Next params not provided')
      routeParams = params.params
    }

    httpSchema = schema.parse({ body, queryParams, routeParams })
  }

  return {
    getCurrentRoute() {
      return request ? request.nextUrl.pathname : ''
    },

    async getAccount() {
      throw new AppError('Not implemented')
    },

    getMethod() {
      if (!request) throw new AppError('Next request is not defined')
      return request.method as HttpMethod
    },

    getAccountId() {
      throw new AppError('Not implemented')
    },

    extendBody(body: object) {
      extendedBody = { ...extendedBody, ...body }
    },

    setBody(body: object) {
      extendedBody = { ...extendedBody, ...body }
    },

    async getBody() {
      if (!httpSchema?.body) throw new AppError('Body is not defined')
      return httpSchema?.body
    },

    async getFile() {
      throw new MethodNotImplementedError('getFile')
    },

    getRouteParams() {
      if (!httpSchema?.routeParams) throw new AppError('Route params are not defined')
      return httpSchema?.routeParams
    },

    getQueryParams() {
      if (!httpSchema?.queryParams) throw new AppError('Query params are not defined')
      return httpSchema?.queryParams
    },

    setCookie(key: string, value: string, duration: number) {
      cookies.push({ key, value, duration })
    },

    async getCookie(key: string) {
      const response = await cookieActions.getCookie(key)
      return response?.data ?? null
    },

    async hasCookie(key: string) {
      const response = await cookieActions.hasCookie(key)
      return Boolean(response?.data)
    },

    async deleteCookie(key: string) {
      await cookieActions.deleteCookie(key)
    },

    async pass() {
      return new RestResponse({ headers: { [HTTP_HEADERS.xPass]: 'true' } })
    },

    statusOk() {
      statusCode = HTTP_STATUS_CODE.ok
      return this as Http<NextSchema, NextResponse<unknown>>
    },

    statusCreated() {
      statusCode = HTTP_STATUS_CODE.created
      return this as Http<NextSchema, NextResponse<unknown>>
    },

    statusNoContent() {
      statusCode = HTTP_STATUS_CODE.noContent
      return this as Http<NextSchema, NextResponse<unknown>>
    },

    sendPagination<PaginationItem>(pagination: PaginationResponse<PaginationItem>) {
      const statusCode = HTTP_STATUS_CODE.ok
      return new RestResponse({
        body: NextResponse.json(pagination, { status: statusCode }),
        statusCode,
      })
    },

    redirect(route: string) {
      const nextResponse = NextResponse.redirect(new URL(route, CLIENT_ENV.webAppUrl))

      if (cookies.length)
        for (const cookie of cookies) {
          nextResponse.cookies.set(cookie.key, cookie.value, {
            path: '/',
            httpOnly: true,
            maxAge: cookie.duration,
          })
        }

      return new RestResponse({
        body: nextResponse,
        statusCode: HTTP_STATUS_CODE.redirect,
        headers: { [HTTP_HEADERS.location]: route },
      })
    },

    send(data: unknown) {
      if (cookies.length) {
        const nextResponse = NextResponse.redirect(
          new URL(request ? request.nextUrl.pathname : '', CLIENT_ENV.webAppUrl),
        )

        for (const cookie of cookies) {
          nextResponse.cookies.set(cookie.key, cookie.value, {
            path: '/',
            httpOnly: true,
            maxAge: cookie.duration,
          })
        }
        return new RestResponse({
          body: nextResponse,
          statusCode,
        })
      }

      return new RestResponse({
        body: NextResponse.json(data, { status: statusCode }),
        statusCode,
      })
    },
  }
}
