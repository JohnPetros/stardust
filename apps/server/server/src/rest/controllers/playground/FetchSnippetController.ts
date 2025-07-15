import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SnippetsRepository } from '@stardust/core/playground/interfaces'
import { GetSnippetUseCase } from '@stardust/core/playground/use-cases'

type Schema = {
  routeParams: {
    snippetId: string
  }
}

export class FetchSnippetController implements Controller<Schema> {
  constructor(private readonly repository: SnippetsRepository) {}

  async handle(http: Http<Schema>) {
    const { snippetId } = http.getRouteParams()
    const accountId = await http.getAccountId()
    const useCase = new GetSnippetUseCase(this.repository)
    const response = await useCase.execute({
      snippetId,
      authorId: accountId,
    })
    return http.statusOk().send(response)
  }
}
