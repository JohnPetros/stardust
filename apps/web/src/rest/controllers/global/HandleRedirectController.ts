import type { Controller, Http } from '@stardust/core/global/interfaces'

function isInternalRedirect(route: string) {
  return route.startsWith('/') && !route.startsWith('//')
}

export const HandleRedirectController = (): Controller => {
  return {
    async handle(http: Http) {
      const queryParams = http.getQueryParams()
      const redirectTo =
        typeof queryParams === 'object' && queryParams !== null
          ? (queryParams as Record<string, unknown>).redirect_to
          : undefined

      if (typeof redirectTo === 'string' && isInternalRedirect(redirectTo)) {
        return http.redirect(redirectTo)
      }

      return await http.pass()
    },
  }
}
