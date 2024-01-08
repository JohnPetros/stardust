export interface ICookiesController {
  setCookie(cookieName: string, cookieValue: string): Promise<void>
  getCookie(cookieName: string): Promise<string | null>
  deleteCookie(cookieName: string): Promise<void>
}
