import { User } from '@stardust/core/global/entities'
import type {
  IAction,
  IActionServer,
  IPlaygroundService,
} from '@stardust/core/global/interfaces'
import type { SnippetDto } from '@stardust/core/playground/dtos'
import { CreateSnippetUseCase } from '@stardust/core/playground/use-cases'

type Request = {
  snippetTitle: string
  snippetCode: string
  isSnippetPublic: boolean
}

type Response = SnippetDto

export const CreateSnippetAction = (
  playgroundService: IPlaygroundService,
): IAction<Request, Response> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const user = User.create(await actionServer.getUser())
      const { snippetTitle, snippetCode, isSnippetPublic } = actionServer.getRequest()
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
