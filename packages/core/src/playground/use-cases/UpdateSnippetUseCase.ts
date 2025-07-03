import { SnippetNotFoundError } from '#playground/domain/errors/SnippetNotFoundError'
import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { SnippetsRepository } from '../interfaces'
import type { SnippetDto } from '../domain/entities/dtos'
import { Name } from '#global/domain/structures/Name'
import { Text } from '#global/domain/structures/Text'
import { Logical } from '#global/domain/structures/Logical'

type Request = {
  snippetId: string
  snippetTitle: string
  snippetCode: string
  isSnippetPublic: boolean
}

type Response = Promise<SnippetDto>

export class UpdateSnippetUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SnippetsRepository) {}

  async execute({ snippetId, snippetTitle, snippetCode, isSnippetPublic }: Request) {
    const snippet = await this.findSnippet(Id.create(snippetId))
    snippet.title = Name.create(snippetTitle)
    snippet.code = Text.create(snippetCode)
    snippet.isPublic = Logical.create(isSnippetPublic)
    await this.repository.replace(snippet)
    return snippet.dto
  }

  private async findSnippet(snippetId: Id) {
    const snippet = await this.repository.findById(snippetId)
    if (!snippet) throw new SnippetNotFoundError()
    return snippet
  }
}
