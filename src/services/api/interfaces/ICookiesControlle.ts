import { Cookie } from '@/@types/cookie'

export interface ICookiesController {
  setCookie(cookie: Cookie): Promise<void>
  getCookie(cookieName: string): Promise<string | null>
  deleteCookie(cookieName: string): Promise<void>
}
