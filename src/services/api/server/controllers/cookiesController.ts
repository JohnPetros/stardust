import { ICookiesController } from '../../interfaces/ICookiesController'
import { useServer } from '../useServer'

import { ROUTES } from '@/utils/constants'

export const CookiesController = (): ICookiesController => {
  const server = useServer()
  const expiresInDefault = 60 * 60 * 24 // 1 day

  return {
    setCookie: async (
      cookieName: string,
      cookieValue: string,
      expiresIn: number = expiresInDefault
    ) => {
      await server.post(`${ROUTES.server.cookies}/${cookieName}/set`, {
        value: cookieValue,
        expiresIn,
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
