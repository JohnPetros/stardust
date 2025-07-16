import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SnippetsRepository } from '@stardust/core/playground/interfaces'
import { UpdateSnippetUseCase } from '@stardust/core/playground/use-cases'

type Schema = {
  routeParams: {
    snippetId: string
  }
  body: {
    title: string
    code: string
    isPublic: boolean
  }
}

export class UpdateSnippetController implements Controller<Schema> {
  constructor(private readonly repository: SnippetsRepository) {}

  async handle(http: Http<Schema>) {
    const { snippetId } = http.getRouteParams()
    const { title, code, isPublic } = await http.getBody()
    const useCase = new UpdateSnippetUseCase(this.repository)
    const response = await useCase.execute({
      snippetId,
      snippetTitle: title,
      snippetCode: code,
      isSnippetPublic: isPublic,
    })
    return http.statusOk().send(response)
  }
}
