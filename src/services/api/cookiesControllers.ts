import { ICookiesController } from './interfaces/ICookiesControlle'
import { Server } from './server'

import { Cookie } from '@/@types/cookie'
import { ROUTES } from '@/utils/constants'

export const CookiesController = (): ICookiesController => {
  const server = Server()

  return {
    setCookie: async (cookie: Cookie) => {
      await server.post(`${ROUTES.server.cookies}/${cookie.name}/set`, {
        cookie,
      })
    },

    getCookie: async (cookieName: string) => {
      const response = await server.get<string>(
        `${ROUTES.server.cookies}/${cookieName}/get`
      )

      console.log(response)

      return response
    },

    deleteCookie: async (cookieName: string) => {
      await server.delete<string>(
        `${ROUTES.server.cookies}/${cookieName}/delete`
      )
    },
  }
}
