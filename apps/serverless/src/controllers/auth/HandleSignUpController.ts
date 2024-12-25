import { IHttp, IController } from '@stardust/core'

type Schema = {
  body: {
    userId: string
  }
}

export const HandleSignUpController = (): IController<Schema> => {
  return {
    async handle(http: IHttp<Schema>) {
      return http.send({ message: 'user saved!' })
    },
  }
}
