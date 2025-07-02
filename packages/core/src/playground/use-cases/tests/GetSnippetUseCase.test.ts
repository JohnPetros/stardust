import { mock, type Mock } from 'ts-jest-mocker'

import { SnippetsFaker } from '#playground/domain/entities/fakers/SnippetsFaker'
import { SnippetNotFoundError } from '#playground/domain/errors/SnippetNotFoundError'
import type { SnippetsRepository } from '../../interfaces'
import { GetSnippetUseCase } from '../GetSnippetUseCase'

describe('Get Snippet Use Case', () => {
  let repository: Mock<SnippetsRepository>
  let useCase: GetSnippetUseCase

  beforeEach(() => {
    repository = mock<SnippetsRepository>()
    repository.findById.mockImplementation()
    useCase = new GetSnippetUseCase(repository)
  })

  it('should throw an error if the snippet is not found', async () => {
    const snippet = SnippetsFaker.fake()
    repository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({
        snippetId: snippet.id.value,
        authorId: snippet.author.id.value,
      }),
    ).rejects.toThrow(SnippetNotFoundError)
  })

  it('should return the snippet if it is found', async () => {
    const snippet = SnippetsFaker.fake()
    repository.findById.mockResolvedValue(snippet)

    const response = await useCase.execute({
      snippetId: snippet.id.value,
      authorId: snippet.author.id.value,
    })

    expect(response).toEqual(snippet.dto)
  })
})
