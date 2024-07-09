import { HttpResponse } from '@/@core/responses'

export type Cookie = {
  key: string
  value: string
  duration: number
}

export interface IHttp {
  getCurrentRoute(): string
  redirect(route: string): HttpResponse
  getSearchParam(key: string): string | null
  setCookie(cookie: Cookie): void
  getCookie(key: string): Cookie | null
  send(data: unknown, statusCode: number): HttpResponse
}
