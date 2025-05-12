import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  queryParams?: {
    redirect_to?: string
  }
}

export const HandleRedirectController = (): Controller<Schema> => {
  return {
    async handle(http: Http<Schema>) {
      const queryParams = http.getQueryParams()
      if (queryParams?.redirect_to) return http.redirect(queryParams?.redirect_to)

      return await http.pass()
    },
  }
}
