import type { Context, Input, Next } from 'hono'
import type { BlankEnv } from 'hono/types'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import type { StatusCode } from 'hono/utils/http-status'

import type { Http, HttpMethod } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import { AppError } from '@stardust/core/global/errors'

type HonoContext = Context<BlankEnv, any, Input>

type Schema = {
  json?: unknown
  param?: unknown
  query?: unknown
}

type HonoHttpSchema<HttpSchema extends Schema> = {
  body?: HttpSchema['json']
  routeParams?: HttpSchema['param']
  queryParams?: HttpSchema['query']
}

export class HonoHttp<HttpSchema extends Schema>
  implements Http<HonoHttpSchema<HttpSchema>, Response>
{
  private readonly context: HonoContext
  private readonly next?: Next

  constructor(context: HonoContext, next?: Next) {
    this.context = context
    this.next = next
  }

  getCurrentRoute(): string {
    return this.context.req.url
  }

  redirect(route: string): RestResponse<Response> {
    const response = this.context.redirect(route)
    return this.sendRestResponse(response)
  }

  private sendRestResponse(response: Response): RestResponse<Response> {
    return new RestResponse({ body: response })
  }

  async getBody(): Promise<HonoHttpSchema<HttpSchema>['body']> {
    // @ts-ignore
    return this.context.req.valid('json')
  }

  async getRouteParams(): Promise<ReturnType<Context['req']['valid']>> {
    // @ts-ignore
    return this.context.req.valid('param')
  }

  async getQueryParams(): Promise<HonoHttpSchema<HttpSchema>['queryParams']> {
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
    const { ping } = await this.context.req.json<{ ping: 'pong' }>()

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

  sendJson(json: unknown, statusCode?: number): RestResponse<Response> {
    this.context.status(statusCode as StatusCode)
    const response = this.context.json(json as object)
    return this.sendRestResponse(response)
  }

  sendResponse(response: Response): RestResponse<Response> {
    return this.sendRestResponse(response)
  }
}
