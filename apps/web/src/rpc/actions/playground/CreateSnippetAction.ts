import { User } from '@stardust/core/global/entities'

import type { Action, Call } from '@stardust/core/global/interfaces'
import type { SnippetDto } from '@stardust/core/playground/dtos'
import type { PlaygroundService } from '@stardust/core/playground/interfaces'
import { CreateSnippetUseCase } from '@stardust/core/playground/use-cases'

type Request = {
  snippetTitle: string
  snippetCode: string
  isSnippetPublic: boolean
}

type Response = SnippetDto

export const CreateSnippetAction = (
  playgroundService: PlaygroundService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const user = User.create(await call.getUser())
      const { snippetTitle, snippetCode, isSnippetPublic } = call.getRequest()
      const useCase = new CreateSnippetUseCase(playgroundService)
      return await useCase.do({
        authorId: user.id.value,
        snippetTitle,
        snippetCode,
        isSnippetPublic,
      })
    },
  }
}
