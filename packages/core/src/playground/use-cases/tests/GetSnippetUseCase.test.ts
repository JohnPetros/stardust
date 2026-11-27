import { mock, type Mock } from 'ts-jest-mocker'

import { Id } from '#global/domain/structures/Id'
import { SnippetsFaker } from '#playground/domain/entities/fakers/SnippetsFaker'
import { SnippetNotFoundError } from '#playground/domain/errors/SnippetNotFoundError'
import { SnippetNotPublicError } from '#playground/domain/errors/SnippetNotPublicError'
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

    await expect(
      useCase.execute({
        snippetId: snippet.id.value,
        authorId: snippet.author.id.value,
      }),
    ).rejects.toThrow(SnippetNotFoundError)
  })

  it('should return a private snippet to its author', async () => {
    const snippet = SnippetsFaker.fake({ isPublic: false })
    repository.findById.mockResolvedValue(snippet)

    const response = await useCase.execute({
      snippetId: snippet.id.value,
      authorId: snippet.author.id.value,
    })

    expect(repository.findById).toHaveBeenCalledWith(snippet.id)
    expect(response).toEqual(snippet.dto)
  })

  it('should return a public snippet to someone who is not its author', async () => {
    const snippet = SnippetsFaker.fake({ isPublic: true })
    repository.findById.mockResolvedValue(snippet)

    const response = await useCase.execute({
      snippetId: snippet.id.value,
      authorId: Id.create().value,
    })

    expect(response).toEqual(snippet.dto)
  })

  it('should throw an error if a private snippet is requested by someone else', async () => {
    const snippet = SnippetsFaker.fake({ isPublic: false })
    repository.findById.mockResolvedValue(snippet)

    await expect(
      useCase.execute({
        snippetId: snippet.id.value,
        authorId: Id.create().value,
      }),
    ).rejects.toThrow(SnippetNotPublicError)
  })
})
