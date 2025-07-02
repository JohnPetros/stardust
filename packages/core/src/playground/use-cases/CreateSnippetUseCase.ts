import type { SnippetsRepository } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'
import type { SnippetDto } from '../domain/entities/dtos'
import { Snippet } from '../domain/entities'

type Request = {
  snippetTitle: string
  snippetCode: string
  isSnippetPublic: boolean
  authorId: string
}

type Response = Promise<SnippetDto>

export class CreateSnippetUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SnippetsRepository) {}

  async execute({ snippetTitle, snippetCode, isSnippetPublic, authorId }: Request) {
    const snippet = Snippet.create({
      title: snippetTitle,
      code: snippetCode,
      isPublic: isSnippetPublic,
      author: { id: authorId },
    })

    await this.repository.add(snippet)
    return snippet.dto
  }
}
