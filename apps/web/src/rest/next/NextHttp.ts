'use server'

import { type NextRequest, NextResponse } from 'next/server'

import type { ZodSchema } from 'zod'

import type { HttpMethod, HttpSchema, IHttp } from '@stardust/core/global/interfaces'
import { ApiResponse } from '@stardust/core/global/responses'
import { AppError, MethodNotImplementedError } from '@stardust/core/global/errors'
import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import type { NextParams } from '@/server/next/types'
import { SupabaseRouteHandlerClient } from '../supabase/clients'
import { SupabaseAuthService, SupabaseProfileService } from '../supabase/services'
import { cookieActions } from '@/server/next-safe-action'
import { ENV } from '@/constants'

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
}: NextHttpParams = {}): Promise<IHttp<NextSchema, NextResponse<unknown>>> => {
  let httpSchema: NextSchema
  const cookies: Cookie[] = []

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

    redirect(route: string) {
      const nextResponse = NextResponse.redirect(new URL(route, ENV.appHost))

      if (cookies.length)
        for (const cookie of cookies) {
          nextResponse.cookies.set(cookie.key, cookie.value, {
            path: '/',
            httpOnly: true,
            maxAge: cookie.duration,
          })
        }

      return new ApiResponse({
        body: nextResponse,
        statusCode: HTTP_STATUS_CODE.redirect,
        headers: { [HTTP_HEADERS.location]: route },
      })
    },

    async getUser() {
      const supabase = SupabaseRouteHandlerClient()
      const authService = SupabaseAuthService(supabase)
      const profileService = SupabaseProfileService(supabase)

      const authResponse = await authService.fetchUserId()
      if (authResponse.isFailure) authResponse.throwError()

      const profileResponse = await profileService.fetchUserById(authResponse.body)
      if (profileResponse.isFailure) profileResponse.throwError()

      return profileResponse.body
    },

    getMethod() {
      if (!request) throw new AppError('Next request is not defined')
      return request.method as HttpMethod
    },

    getBody() {
      if (!httpSchema?.body) throw new AppError('Body is not defined')
      return httpSchema?.body
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

    async deleteCookie(key) {
      await cookieActions.deleteCookie(key)
    },

    pass() {
      return new ApiResponse({ headers: { [HTTP_HEADERS.xPass]: 'true' } })
    },

    send(data: unknown, statusCode = HTTP_STATUS_CODE.ok) {
      if (cookies.length) {
        const nextResponse = NextResponse.redirect(
          new URL(request ? request.nextUrl.pathname : '', ENV.appHost),
        )

        for (const cookie of cookies) {
          nextResponse.cookies.set(cookie.key, cookie.value, {
            path: '/',
            httpOnly: true,
            maxAge: cookie.duration,
          })
        }
        return new ApiResponse({
          body: nextResponse,
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
