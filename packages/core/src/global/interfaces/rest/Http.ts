import type { PaginationResponse } from '#global/responses/PaginationResponse'
import type { RestResponse } from '#global/responses/RestResponse'
import type { UserDto } from '#profile/domain/entities/dtos/UserDto'

export type HttpSchema = {
  body?: unknown
  routeParams?: unknown
  queryParams?: unknown
}

export type HttpMethod = 'GET' | 'POST'

export interface Http<Schema extends HttpSchema = HttpSchema, Response = unknown> {
  getCurrentRoute(): string
  redirect(route: string): RestResponse<Response>
  getBody(): Promise<Schema['body']>
  getRouteParams(): Schema['routeParams']
  getQueryParams(): Schema['queryParams']
  getUser(): Promise<UserDto>
  getMethod(): HttpMethod
  setCookie(key: string, value: string, duration: number): void
  getCookie(key: string): Promise<string | null>
  deleteCookie(key: string): Promise<void>
  hasCookie(key: string): Promise<boolean>
  pass(): Promise<RestResponse<Response>>
  statusOk(): this
  statusCreated(): this
  statusNoContent(): this
  sendPagination<PaginationItem>(
    pagination: PaginationResponse<PaginationItem>,
  ): RestResponse<Response>
  send(json?: unknown, statusCode?: number): RestResponse<Response>
}
