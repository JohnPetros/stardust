import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import { SnippetNotFoundError } from '#playground/domain/errors/SnippetNotFoundError'
import type { SnippetsRepository } from '../interfaces'

type Request = {
  snippetId: string
}

type Response = Promise<void>

export class DeleteSnippetUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SnippetsRepository) {}

  async execute({ snippetId }: Request) {
    const snippet = await this.findSnippet(Id.create(snippetId))
    await this.repository.remove(snippet.id)
  }

  private async findSnippet(snippetId: Id) {
    const snippet = await this.repository.findById(snippetId)
    if (!snippet) throw new SnippetNotFoundError()
    return snippet
  }
}
