export type CookieConfig = {
  key: string
  value: string
  duration: number
}

export interface IHttp<Response> {
  getCurrentRoute(): string
  redirect(route: string): Response
  getSearchParam(key: string): string | null
  setCookie(config: CookieConfig): void
  send(data: unknown): Response
}
