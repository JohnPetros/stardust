import type { UserDto } from '#profile/domain/entities/dtos/UserDto'

export interface Call<Request = void> {
  getRequest(): Request
  redirect(route: string): never
  notFound(): never
  setCookie(key: string, value: string, duration?: number): Promise<void>
  getCookie(key: string): Promise<string | null>
  deleteCookie(key: string): Promise<void>
  hasCookie(key: string): Promise<boolean>
  getUser(): Promise<UserDto>
}
