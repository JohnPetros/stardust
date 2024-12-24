import type { IController, IHttp } from '@stardust/core/interfaces'

type Schema = {
  queryParams?: {
    redirect_to?: string
  }
}

export const HandleRedirectController = (): IController<Schema> => {
  return {
    async handle(http: IHttp<Schema>) {
      const queryParams = http.getQueryParams()
      if (queryParams?.redirect_to) return http.redirect(queryParams?.redirect_to)

      return http.pass()
    },
  }
}
