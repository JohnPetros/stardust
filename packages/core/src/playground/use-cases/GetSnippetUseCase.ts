import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/index'
import { SnippetNotPublicError } from '#playground/domain/errors/SnippetNotPublicError'
import { SnippetNotFoundError } from '#playground/domain/errors/SnippetNotFoundError'
import type { SnippetDto } from '../domain/entities/dtos'
import type { SnippetsRepository } from '../interfaces'

type Request = {
  snippetId: string
  authorId: string
}

type Response = Promise<SnippetDto>

export class GetSnippetUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SnippetsRepository) {}

  async execute({ snippetId, authorId }: Request) {
    const snippet = await this.repository.findById(Id.create(snippetId))
    if (!snippet) throw new SnippetNotFoundError()

    const isSnippetAuthor = snippet.author.id.value === authorId

    if (!isSnippetAuthor && snippet.isPublic.isFalse) {
      throw new SnippetNotPublicError()
    }

    return snippet.dto
  }
}
