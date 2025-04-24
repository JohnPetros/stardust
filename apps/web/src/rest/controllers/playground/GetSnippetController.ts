import type {
  IController,
  IHttp,
  PlaygroundService,
} from '@stardust/core/global/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { GetSnippetUseCase } from '@stardust/core/playground/use-cases'

type Schema = {
  routeParams: {
    snippetId: string
  }
}

export const GetSnippetController = (
  playgroundService: PlaygroundService,
): IController => {
  return {
    async handle(http: IHttp<Schema>) {
      const { snippetId } = http.getRouteParams()
      const useCase = new GetSnippetUseCase(playgroundService)
      const snippetDto = await useCase.do({ snippetId })
      return http.send(snippetDto, HTTP_STATUS_CODE.ok)
    },
  }
}
