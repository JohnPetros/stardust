import type { Controller, Http } from '@stardust/core/global/interfaces'

import { COOKIES } from '@/constants'

export const SetAccessTokenController = (): Controller => {
  return {
    async handle(http: Http) {
      const header = http.getHeader('Authorization')
      if (!header) return http.pass()

      const token = header.split(' ')[1]

      http.setCookie(
        COOKIES.accessToken.key,
        token,
        COOKIES.accessToken.durationInSeconds,
      )
      return http.pass()
    },
  }
}
