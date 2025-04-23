import type { UserDto } from '../../dtos'
import type { RestResponse } from '../../responses'

export type HttpSchema = {
  body?: unknown
  routeParams?: unknown
  queryParams?: unknown
}

export type HttpMethod = 'GET' | 'POST'

export interface IHttp<Schema extends HttpSchema = HttpSchema, Response = unknown> {
  getCurrentRoute(): string
  redirect(route: string): RestResponse
  getBody(): Schema['body']
  getRouteParams(): Schema['routeParams']
  getQueryParams(): Schema['queryParams']
  getUser(): Promise<UserDto>
  getMethod(): HttpMethod
  setCookie(key: string, value: string, duration: number): void
  getCookie(key: string): Promise<string | null>
  deleteCookie(key: string): Promise<void>
  hasCookie(key: string): Promise<boolean>
  pass(): RestResponse
  send(data?: unknown, statusCode?: number): RestResponse<Response>
}
