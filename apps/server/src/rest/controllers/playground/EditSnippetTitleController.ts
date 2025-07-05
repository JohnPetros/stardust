import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SnippetsRepository } from '@stardust/core/playground/interfaces'
import { EditSnippetTitleUseCase } from '@stardust/core/playground/use-cases'

type Schema = {
  routeParams: {
    snippetId: string
  }
  body: {
    title: string
  }
}

export class EditSnippetTitleController implements Controller<Schema> {
  constructor(private readonly repository: SnippetsRepository) {}

  async handle(http: Http<Schema>) {
    const { snippetId } = http.getRouteParams()
    const { title } = await http.getBody()
    const useCase = new EditSnippetTitleUseCase(this.repository)
    const response = await useCase.execute({
      snippetId,
      snippetTitle: title,
    })
    return http.statusOk().send(response)
  }
}
