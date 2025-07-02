import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SnippetsRepository } from '@stardust/core/playground/interfaces'
import { DeleteSnippetUseCase } from '@stardust/core/playground/use-cases'

type Schema = {
  routeParams: {
    snippetId: string
  }
}

export class DeleteSnippetController implements Controller<Schema> {
  constructor(private readonly repository: SnippetsRepository) {}

  async handle(http: Http<Schema>) {
    const { snippetId } = http.getRouteParams()
    const useCase = new DeleteSnippetUseCase(this.repository)
    const response = await useCase.execute({
      snippetId,
    })
    return http.statusOk().send(response)
  }
}
