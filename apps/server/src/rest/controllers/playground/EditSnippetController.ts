import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SnippetsRepository } from '@stardust/core/playground/interfaces'
import { EditSnippetUseCase } from '@stardust/core/playground/use-cases'

type Schema = {
  routeParams: {
    snippetId: string
  }
  body: {
    title?: string
    code?: string
  }
}

export class EditSnippetController implements Controller<Schema> {
  constructor(private readonly repository: SnippetsRepository) {}

  async handle(http: Http<Schema>) {
    const { snippetId } = http.getRouteParams()
    const { title, code } = await http.getBody()
    const useCase = new EditSnippetUseCase(this.repository)
    const response = await useCase.execute({
      snippetId,
      snippetTitle: title,
      snippetCode: code,
    })
    return http.statusOk().send(response)
  }
}
