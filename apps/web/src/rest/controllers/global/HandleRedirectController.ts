import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  queryParams?: Record<string, unknown>
}

function isInternalRedirect(route: string) {
  return route.startsWith('/') && !route.startsWith('//')
}

export const HandleRedirectController = (): Controller<Schema> => {
  return {
    async handle(http: Http<Schema>) {
      const queryParams = http.getQueryParams()
      const redirectTo = queryParams?.redirect_to

      if (typeof redirectTo === 'string' && isInternalRedirect(redirectTo)) {
        return http.redirect(redirectTo)
      }

      return await http.pass()
    },
  }
}
