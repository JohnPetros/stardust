import { SnippetNotFoundError } from '#playground/domain/errors/SnippetNotFoundError'
import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { SnippetDto } from '../domain/entities/dtos'
import type { SnippetsRepository } from '../interfaces'
import { Name } from '#global/domain/structures/Name'

type Request = {
  snippetId: string
  snippetTitle: string
}

type Response = Promise<SnippetDto>

export class EditSnippetTitleUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SnippetsRepository) {}

  async execute({ snippetId, snippetTitle }: Request) {
    const snippet = await this.repository.findById(Id.create(snippetId))
    if (!snippet) throw new SnippetNotFoundError()
    snippet.title = Name.create(snippetTitle)
    await this.repository.replace(snippet)
    return snippet.dto
  }
}
