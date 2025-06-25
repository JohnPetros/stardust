import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import type { PlaygroundService } from '../interfaces'
import { Snippet } from '../domain/entities'

type Request = {
  snippetId: string
  snippetTitle?: string
  snippetCode?: string
}

export class EditSnippetUseCase implements UseCase<Request> {
  constructor(private readonly playgroundService: PlaygroundService) {}

  async execute({ snippetId, snippetTitle, snippetCode }: Request) {
    const snippet = await this.fetchSnippet(snippetId)
    if (snippetTitle) snippet.title = snippetTitle
    if (snippetCode) snippet.code = snippetCode

    await this.updateSnippet(snippet)
    return snippet.dto
  }

  private async fetchSnippet(snippetId: string) {
    const response = await this.playgroundService.fetchSnippetById(Id.create(snippetId))
    if (response.isFailure) response.throwError()
    return Snippet.create(response.body)
  }

  private async updateSnippet(snippet: Snippet) {
    const response = await this.playgroundService.updateSnippet(snippet)
    if (response.isFailure) response.throwError()
  }
}
