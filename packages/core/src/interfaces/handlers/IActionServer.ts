import type { UserDto } from '#global/dtos'

export interface IActionServer<Request = void> {
  getRequest(): Request
  redirect(route: string): unknown
  notFound(): unknown
  setCookie(key: string, value: string, duration?: number): Promise<void>
  getCookie(key: string): Promise<string | null>
  deleteCookie(key: string): Promise<void>
  hasCookie(key: string): Promise<boolean>
  getUser(): Promise<UserDto>
}
