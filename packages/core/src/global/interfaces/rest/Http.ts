import type { RestResponse } from '#global/responses/RestResponse'
import type { AccountDto } from '#auth/domain/entities/dtos/index'
import type { PaginationResponse } from '#global/responses/index'

export type HttpSchema = {
  body?: unknown
  routeParams?: unknown
  queryParams?: unknown
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface Http<Schema extends HttpSchema = HttpSchema, Response = unknown> {
  getCurrentRoute(): string
  redirect(route: string): RestResponse<Response>
  getBody(): Promise<Schema['body']>
  getRouteParams(): Schema['routeParams']
  getQueryParams(): Schema['queryParams']
  getAccount(): Promise<AccountDto>
  getAccountId(): Promise<string>
  getMethod(): HttpMethod
  getFile(): Promise<File>
  setCookie(key: string, value: string, duration: number): void
  getCookie(key: string): Promise<string | null>
  deleteCookie(key: string): Promise<void>
  hasCookie(key: string): Promise<boolean>
  extendBody(body: unknown): void
  setBody(body: unknown): void
  pass(): Promise<RestResponse<Response>>
  statusOk(): this
  statusCreated(): this
  statusNoContent(): this
  sendPagination<PaginationItem>(
    pagination: PaginationResponse<PaginationItem>,
  ): RestResponse<Response>
  send(json?: unknown, statusCode?: number): RestResponse<Response>
}
