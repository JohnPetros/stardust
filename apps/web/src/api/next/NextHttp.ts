'use server'

import { type NextRequest, NextResponse } from 'next/server'
import type { ZodObject, ZodSchema } from 'zod'

import type { HttpSchema, IHttp } from '@stardust/core/interfaces'
import { ApiResponse } from '@stardust/core/responses'
import { AppError } from '@stardust/core/global/errors'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

import type { NextParams } from '@/server/next/types'
import { SupabaseRouteHandlerClient } from '../supabase/clients'
import { SupabaseAuthService, SupabaseProfileService } from '../supabase/services'

type NextHttpParams<HttpSchema> = {
  request?: NextRequest
  schema?: ZodSchema<HttpSchema>
  params?: NextParams
}

export const NextHttp = async <NextSchema extends HttpSchema>({
  request,
  schema,
  params,
}: NextHttpParams<NextSchema> = {}): Promise<IHttp<NextSchema>> => {
  let nextRedirectResponse: NextResponse<unknown>
  let httpSchema: NextSchema

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
      nextRedirectResponse.cookies.set(key, value, {
        path: '/',
        httpOnly: true,
        maxAge: duration,
      })
    },

    getCookie(key: string) {
      throw new Error('NextHttp getCookie method not implemented')
    },

    pass() {
      return new ApiResponse({ headers: { 'X-Pass': 'true' } })
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
