import type { UserDto } from '#global/dtos'
import type { ApiResponse } from '@stardust/core/responses'

export type HttpSchema = {
  body?: unknown
  routeParams?: unknown
  queryParams?: unknown
}

export interface IHttp<Schema extends HttpSchema = HttpSchema> {
  getCurrentRoute(): string
  redirect(route: string): ApiResponse
  getBody(): Schema['body']
  getRouteParams(): Schema['routeParams']
  getQueryParams(): Schema['queryParams']
  getUser(): Promise<UserDto>
  setCookie(key: string, value: string, duration: number): void
  getCookie(key: string): string | null
  pass(): ApiResponse
  send(data?: unknown, statusCode?: number): ApiResponse
}
