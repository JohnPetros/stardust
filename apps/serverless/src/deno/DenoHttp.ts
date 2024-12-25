import { IHttp, HttpSchema, AppError, HTTP_STATUS_CODE } from '@stardust/core'

type DenoHttpParams<DenoSchema extends HttpSchema> = {
  body: DenoSchema['body']
}

export const DenoHttp = <DenoSchema extends HttpSchema>({
  body,
}: DenoHttpParams<DenoSchema>): IHttp<DenoSchema> => {
  return {
    getCookie() {
      throw new Error('Method not implemented')
    },

    redirect() {
      throw new Error('Method not implemented')
    },

    getCurrentRoute() {
      throw new Error('Method not implemented')
    },

    getRouteParams() {
      throw new Error('Method not implemented')
    },

    getQueryParams() {
      throw new Error('Method not implemented')
    },

    getBody() {
      if (!body) throw new AppError('Body is not defined')
      return body
    },

    getUser() {
      throw new Error('Method not implemented')
    },

    setCookie() {
      throw new Error('Method not implemented')
    },

    pass() {
      throw new Error('Method not implemented')
    },

    // @ts-ignore:
    send(data?: unknown, statusCode?: number) {
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
        status: statusCode ?? HTTP_STATUS_CODE.ok,
      })
    },
  }
}
