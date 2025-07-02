import { mock, type Mock } from 'ts-jest-mocker'

import { SnippetsFaker } from '#playground/domain/entities/fakers/SnippetsFaker'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Id } from '#global/domain/structures/Id'
import type { SnippetsRepository } from '../../interfaces'
import { ListSnippetsUseCase } from '../ListSnippetsUseCase'
import { PaginationResponse } from '#global/responses/PaginationResponse'

describe('List Snippets Use Case', () => {
  let repository: Mock<SnippetsRepository>
  let useCase: ListSnippetsUseCase

  beforeEach(() => {
    repository = mock<SnippetsRepository>()
    repository.findManySnippets.mockImplementation()
    useCase = new ListSnippetsUseCase(repository)
  })

  it('should return a pagination response with the snippets', async () => {
    repository.findManySnippets.mockResolvedValue({
      snippets: [SnippetsFaker.fake()],
      totalSnippetsCount: 1,
    })
    const page = 1
    const authorId = Id.create()
    const itemsPerPage = 10

    await useCase.execute({
      page,
      itemsPerPage,
      authorId: authorId.value,
    })

    expect(repository.findManySnippets).toHaveBeenCalledWith({
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      authorId,
    })
  })

  it('should return a pagination response with the snippets', async () => {
    const snippets = SnippetsFaker.fakeMany(10)
    repository.findManySnippets.mockResolvedValue({
      snippets,
      totalSnippetsCount: snippets.length,
    })
    const page = 1
    const authorId = Id.create()
    const itemsPerPage = 10

    const response = await useCase.execute({
      page,
      itemsPerPage,
      authorId: authorId.value,
    })

    expect(response).toEqual(
      new PaginationResponse(
        snippets.map((snippet) => snippet.dto),
        snippets.length,
        itemsPerPage,
      ),
    )
  })
})
