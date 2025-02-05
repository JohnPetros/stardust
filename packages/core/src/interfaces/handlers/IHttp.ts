import type { UserDto } from '#global/dtos'
import type { ApiResponse } from '#responses'

export type HttpSchema = {
  body?: unknown
  routeParams?: unknown
  queryParams?: unknown
}

export type HttpMethod = 'GET' | 'POST'

export interface IHttp<Schema extends HttpSchema = HttpSchema, Response = unknown> {
  getCurrentRoute(): string
  redirect(route: string): ApiResponse
  getBody(): Schema['body']
  getRouteParams(): Schema['routeParams']
  getQueryParams(): Schema['queryParams']
  getUser(): Promise<UserDto>
  getMethod(): HttpMethod
  setCookie(key: string, value: string, duration: number): void
  getCookie(key: string): Promise<string | null>
  hasCookie(key: string): Promise<boolean>
  pass(): ApiResponse
  send(data?: unknown, statusCode?: number): ApiResponse<Response>
}
