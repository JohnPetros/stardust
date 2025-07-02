import type { UseCase } from '#global/interfaces/UseCase'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Id } from '#global/domain/structures/Id'
import type { SnippetsRepository } from '../interfaces'
import type { SnippetDto } from '../domain/entities/dtos'
import { PaginationResponse } from '#global/responses/PaginationResponse'

type Request = {
  page: number
  itemsPerPage: number
  authorId: string
}

type Response = Promise<PaginationResponse<SnippetDto>>

export class ListSnippetsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SnippetsRepository) {}

  async execute({ page, itemsPerPage, authorId }: Request) {
    const snippets = await this.repository.findManySnippets({
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      authorId: Id.create(authorId),
    })
    return new PaginationResponse(
      snippets.snippets.map((snippet) => snippet.dto),
      snippets.totalSnippetsCount,
      itemsPerPage,
    )
  }
}
