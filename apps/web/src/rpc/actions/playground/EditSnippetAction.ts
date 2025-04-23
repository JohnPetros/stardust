import type { Action, Call } from '@stardust/core/global/interfaces'
import type { SnippetDto } from '@stardust/core/playground/dtos'
import type { PlaygroundService } from '@stardust/core/playground/interfaces'
import { EditSnippetUseCase } from '@stardust/core/playground/use-cases'

type Request = {
  snippetId: string
  snippetTitle?: string
  snippetCode?: string
}

type Response = SnippetDto

export const EditSnippetAction = (
  playgroundService: PlaygroundService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { snippetId, snippetTitle, snippetCode } = call.getRequest()
      const useCase = new EditSnippetUseCase(playgroundService)
      return await useCase.do({
        snippetId,
        snippetTitle,
        snippetCode,
      })
    },
  }
}
