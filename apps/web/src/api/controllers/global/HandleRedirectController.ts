import type { IController, IHttp } from '@stardust/core/interfaces'

type Schema = {
  queryParams: {
    redirect_to?: string
  }
}

export const HandleRedirectController = (): IController<Schema> => {
  return {
    async handle(http: IHttp<Schema>) {
      const { redirect_to } = http.getQueryParams()
      if (redirect_to) return http.redirect(redirect_to)

      return http.pass()
    },
  }
}
