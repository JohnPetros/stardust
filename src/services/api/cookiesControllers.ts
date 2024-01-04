import { ICookiesController } from './interfaces/ICookiesControlle'
import { Server } from './server'

import { ROUTES } from '@/utils/constants'

export const CookiesController = (): ICookiesController => {
  const server = Server()

  return {
    setCookie: async (cookieName: string, cookieValue: string) => {
      await server.post(`${ROUTES.server.cookies}/${cookieName}/set`, {
        cookieValue,
      })
    },

    getCookie: async (cookieName: string) => {
      const response = await server.get<string>(
        `${ROUTES.server.cookies}/${cookieName}/get`
      )

      return response
    },

    deleteCookie: async (cookieName: string) => {
      await server.delete<string>(
        `${ROUTES.server.cookies}/${cookieName}/delete`
      )
    },
  }
}
