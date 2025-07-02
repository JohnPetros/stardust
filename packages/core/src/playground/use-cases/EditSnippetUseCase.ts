import { SnippetNotFoundError } from '#playground/domain/errors/SnippetNotFoundError'
import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { SnippetsRepository } from '../interfaces'
import type { SnippetDto } from '../domain/entities/dtos'

type Request = {
  snippetId: string
  snippetTitle?: string
  snippetCode?: string
}

type Response = Promise<SnippetDto>

export class EditSnippetUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SnippetsRepository) {}

  async execute({ snippetId, snippetTitle, snippetCode }: Request) {
    const snippet = await this.findSnippet(Id.create(snippetId))
    if (snippetTitle) snippet.title = snippetTitle
    if (snippetCode) snippet.code = snippetCode

    await this.repository.replace(snippet)
    return snippet.dto
  }

  private async findSnippet(snippetId: Id) {
    const snippet = await this.repository.findById(snippetId)
    if (!snippet) throw new SnippetNotFoundError()
    return snippet
  }
}
