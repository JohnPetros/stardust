import type {
  IAction,
  IActionServer,
  IPlaygroundService,
} from '@stardust/core/interfaces'
import type { SnippetDto } from '@stardust/core/playground/dtos'
import { EditSnippetUseCase } from '@stardust/core/playground/use-cases'

type Request = {
  snippetId: string
  snippetTitle?: string
  snippetCode?: string
}

type Response = SnippetDto

export const EditSnippetAction = (
  playgroundService: IPlaygroundService,
): IAction<Request, Response> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { snippetId, snippetTitle, snippetCode } = actionServer.getRequest()
      const useCase = new EditSnippetUseCase(playgroundService)
      return await useCase.do({
        snippetId,
        snippetTitle,
        snippetCode,
      })
    },
  }
}
