import type { Context, Next } from 'hono'
import type { InputToDataByTarget } from 'hono/types'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import type { StatusCode } from 'hono/utils/http-status'
import type { SupabaseClient } from '@supabase/supabase-js'

import type { Http, HttpMethod } from '@stardust/core/global/interfaces'
import { type PaginationResponse, RestResponse } from '@stardust/core/global/responses'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import { AppError } from '@stardust/core/global/errors'
import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import type { InngestAmqp } from '@/queue/inngest/InngestAmqp'

type HonoSchema<HonoContext> = (HonoContext extends Context<
  any,
  any,
  infer HonoContextInput
>
  ? HonoContextInput
  : never)['out']

type HonoHttpSchema<HonoContext> = {
  body: InputToDataByTarget<HonoSchema<HonoContext>, 'json'>
  routeParams: InputToDataByTarget<HonoSchema<HonoContext>, 'param'>
  queryParams: InputToDataByTarget<HonoSchema<HonoContext>, 'query'>
}

export class HonoHttp<HonoContext extends Context>
  implements Http<HonoHttpSchema<HonoContext>, Response>
{
  private readonly context: HonoContext
  private readonly next?: Next
  readonly schema?: HonoHttpSchema<HonoContext>

  constructor(context: HonoContext, next?: Next) {
    this.context = context
    this.next = next
  }

  getCurrentRoute(): string {
    return this.context.req.url
  }

  redirect(route: string): RestResponse<Response> {
    const body = this.context.redirect(route)
    return new RestResponse({
      body,
      statusCode: body.status,
      headers: {
        'X-Hono-Response': 'true',
      },
    })
  }

  async getBody(): Promise<HonoHttpSchema<HonoContext>['body']> {
    // @ts-ignore
    return this.context.req.valid('json')
  }

  getRouteParams(): HonoHttpSchema<HonoContext>['routeParams'] {
    // @ts-ignore
    return this.context.req.valid('param')
  }

  getQueryParams(): HonoHttpSchema<HonoContext>['queryParams'] {
    // @ts-ignore
    return this.context.req.valid('query')
  }

  async getUser(): Promise<UserDto> {
    return (await this.context.req.json()) as UserDto
  }

  getMethod(): HttpMethod {
    return this.context.req.method as HttpMethod
  }

  setCookie(key: string, value: string, duration: number): void {
    setCookie(this.context, key, value, {
      maxAge: duration,
      path: '/',
    })
  }

  async getCookie(key: string): Promise<string | null> {
    return getCookie(this.context, key) ?? null
  }

  async deleteCookie(key: string): Promise<void> {
    deleteCookie(this.context, key)
  }

  async hasCookie(key: string): Promise<boolean> {
    return this.getCookie(key) !== null
  }

  async pass(): Promise<RestResponse<Response>> {
    if (!this.next) throw new AppError('HonoHttp next is not defined')

    await this.next()
    return new RestResponse()
  }

  statusOk(): this {
    this.context.status(HTTP_STATUS_CODE.ok)
    return this
  }

  statusCreated(): this {
    this.context.status(HTTP_STATUS_CODE.created)
    return this
  }

  statusNoContent(): this {
    this.context.status(HTTP_STATUS_CODE.noContent)
    return this
  }

  send(data: unknown): RestResponse<Response> {
    const body = this.context.json(data as object)
    const headers = this.getResponseHeaders()
    return new RestResponse({
      body,
      statusCode: body.status,
      headers: {
        'X-Hono-Response': 'true',
        ...headers,
      },
    })
  }

  sendPagination<Item>(response: PaginationResponse<Item>): RestResponse<Response> {
    this.context.header(HTTP_HEADERS.xPaginationResponse, 'true')
    this.context.header(
      HTTP_HEADERS.xTotalItemsCount,
      response.totalItemsCount.toString(),
    )
    this.context.header(
      HTTP_HEADERS.xTotalPagesCount,
      response.totalPagesCount.toString(),
    )
    this.context.header(HTTP_HEADERS.xItemsPerPage, response.itemsPerPage.toString())
    return this.send(response.items)
  }

  sendResponse(response: RestResponse): Response {
    if (response.getHeader('X-Hono-Response') === 'true') {
      return response.body as Response
    }

    this.context.status(response.statusCode as StatusCode)

    if (response.isFailure) {
      return this.context.json({
        error: response.errorMessage,
      })
    }
    return this.context.json(response.body ?? {})
  }

  getResponseHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}
    this.context.res.headers.forEach((value, key) => {
      headers[key] = value
    })
    return headers
  }

  getSupabase(): SupabaseClient {
    return this.context.get('supabase')
  }

  getInngest(): InngestAmqp<void> {
    return this.context.get('inngest')
  }
}
