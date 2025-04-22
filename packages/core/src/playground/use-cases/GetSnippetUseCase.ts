import type { IPlaygroundService, IUseCase } from '../../global/interfaces'
import type { SnippetDto } from '../domain/dtos'
import { Snippet } from '../domain/entities'

type Request = {
  snippetId: string
}

type Response = Promise<SnippetDto>

export class GetSnippetUseCase implements IUseCase<Request, Response> {
  constructor(private readonly playgroundService: IPlaygroundService) {}

  async do({ snippetId }: Request) {
    const snippet = await this.fetchSnippet(snippetId)

    if (snippet.isPublic.isFalse) {
    }

    return snippet.dto
  }

  private async fetchSnippet(snippetId: string) {
    const response = await this.playgroundService.fetchSnippetById(snippetId)
    if (response.isFailure) response.throwError()
    return Snippet.create(response.body)
  }
}
