import type { Action, Call } from '@stardust/core/global/interfaces'
import type { PlaygroundService } from '@stardust/core/playground/interfaces'
import type { SnippetDto } from '@stardust/core/playground/entities/dtos'
import { Id } from '@stardust/core/global/structures'
import { User } from '@stardust/core/profile/entities'
import { Snippet } from '@stardust/core/playground/entities'

type Request = {
  snippetId: string
}

type Response = {
  snippet: SnippetDto
  isPageNotPublic: boolean
}

export const AccessSnippetPageAction = (
  service: PlaygroundService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { snippetId } = call.getRequest()
      const user = User.create(await call.getUser())
      const response = await service.fetchSnippetById(Id.create(snippetId))
      if (response.isFailure) response.throwError()
      const snippet = Snippet.create(response.body)

      const isPageNotPublic = snippet.author.isEqualTo(user).notAndNot(snippet.isPublic)

      return {
        snippet: snippet.dto,
        isPageNotPublic: isPageNotPublic.isTrue,
      }
    },
  }
}
