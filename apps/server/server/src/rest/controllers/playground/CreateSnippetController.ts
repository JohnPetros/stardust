import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SnippetsRepository } from '@stardust/core/playground/interfaces'
import { CreateSnippetUseCase } from '@stardust/core/playground/use-cases'

type Schema = {
  body: {
    title: string
    code: string
    isPublic: boolean
  }
}

export class CreateSnippetController implements Controller<Schema> {
  constructor(private readonly repository: SnippetsRepository) {}

  async handle(http: Http<Schema>) {
    const { title, code, isPublic } = await http.getBody()
    const account = await http.getAccount()
    const useCase = new CreateSnippetUseCase(this.repository)
    const response = await useCase.execute({
      snippetTitle: title,
      snippetCode: code,
      isSnippetPublic: isPublic,
      authorId: String(account.id),
    })
    return http.statusCreated().send(response)
  }
}
