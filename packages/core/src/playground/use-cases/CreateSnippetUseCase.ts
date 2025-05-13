import type { PlaygroundService } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'
import type { SnippetDto } from '../domain/dtos'
import { Snippet } from '../domain/entities'

type Request = {
  snippetTitle: string
  snippetCode: string
  isSnippetPublic: boolean
  authorId: string
}

type Response = Promise<SnippetDto>

export class CreateSnippetUseCase implements UseCase<Request, Response> {
  constructor(private readonly playgroundService: PlaygroundService) {}

  async execute({ snippetTitle, snippetCode, isSnippetPublic, authorId }: Request) {
    const snippet = Snippet.create({
      title: snippetTitle,
      code: snippetCode,
      isPublic: isSnippetPublic,
      author: { id: authorId },
    })

    await this.saveSnippet(snippet)
    return snippet.dto
  }

  private async saveSnippet(snippet: Snippet) {
    const response = await this.playgroundService.saveSnippet(snippet)
    if (response.isFailure) response.throwError()
  }
}
