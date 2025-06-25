import type { UseCase } from '#global/interfaces/UseCase'
import type { PlaygroundService } from '../interfaces'
import type { SnippetDto } from '../domain/dtos'
import { Snippet } from '../domain/entities'
import { Id } from '../../main'

type Request = {
  snippetId: string
}

type Response = Promise<SnippetDto>

export class GetSnippetUseCase implements UseCase<Request, Response> {
  constructor(private readonly playgroundService: PlaygroundService) {}

  async execute({ snippetId }: Request) {
    const snippet = await this.fetchSnippet(snippetId)

    if (snippet.isPublic.isFalse) {
    }

    return snippet.dto
  }

  private async fetchSnippet(snippetId: string) {
    const response = await this.playgroundService.fetchSnippetById(Id.create(snippetId))
    if (response.isFailure) response.throwError()
    return Snippet.create(response.body)
  }
}
