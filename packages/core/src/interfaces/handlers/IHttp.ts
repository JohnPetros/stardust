import type { ApiResponse } from '@stardust/core/responses'

export interface IHttp {
  getCurrentRoute(): string
  redirect(route: string): ApiResponse
  getSearchParam(key: string): string | null
  getBody<Request>(): Promise<Request>
  setCookie(key: string, value: string, duration: number): void
  getCookie(key: string): string | null
  send(data: unknown, statusCode: number): ApiResponse
}
