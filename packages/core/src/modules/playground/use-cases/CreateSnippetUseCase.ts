import type { IPlaygroundService, IUseCase } from '#interfaces'
import type { SnippetDto } from '#playground/dtos'
import { Snippet } from '#playground/entities'

type Request = {
  snippetTitle: string
  snippetCode: string
  isSnippetPublic: boolean
  authorId: string
}

type Response = Promise<SnippetDto>

export class CreateSnippetUseCase implements IUseCase<Request, Response> {
  constructor(private readonly playgroundService: IPlaygroundService) {}

  async do({ snippetTitle, snippetCode, isSnippetPublic, authorId }: Request) {
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
