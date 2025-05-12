import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { PlaygroundService } from '@stardust/core/playground/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { GetSnippetUseCase } from '@stardust/core/playground/use-cases'

type Schema = {
  routeParams: {
    snippetId: string
  }
}

export const GetSnippetController = (
  playgroundService: PlaygroundService,
): Controller => {
  return {
    async handle(http: Http<Schema>) {
      const { snippetId } = await http.getRouteParams()
      const useCase = new GetSnippetUseCase(playgroundService)
      const snippetDto = await useCase.do({ snippetId })
      return http.sendJson(snippetDto, HTTP_STATUS_CODE.ok)
    },
  }
}
