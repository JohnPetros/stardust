import { mock, type Mock } from 'ts-jest-mocker'

import { SnippetsFaker } from '#playground/domain/entities/fakers/SnippetsFaker'
import type { SnippetsRepository } from '../../interfaces'
import { CreateSnippetUseCase } from '../CreateSnippetUseCase'

describe('Create Snippet Use Case', () => {
  let repository: Mock<SnippetsRepository>
  let useCase: CreateSnippetUseCase

  beforeEach(() => {
    repository = mock<SnippetsRepository>()
    repository.add.mockImplementation()
    useCase = new CreateSnippetUseCase(repository)
  })

  it('should create a snippet', async () => {
    const snippet = SnippetsFaker.fake()
    await useCase.execute({
      snippetTitle: snippet.title.value,
      snippetCode: snippet.code.value,
      isSnippetPublic: snippet.isPublic.value,
      authorId: snippet.author.id.value,
    })

    expect(repository.add).toHaveBeenCalledTimes(1)
  })

  it('should return the created snippet', async () => {
    const snippet = SnippetsFaker.fake()
    const response = await useCase.execute({
      snippetTitle: snippet.title.value,
      snippetCode: snippet.code.value,
      isSnippetPublic: snippet.isPublic.value,
      authorId: snippet.author.id.value,
    })

    expect(response.title).toBe(snippet.title.value)
    expect(response.code).toBe(snippet.code.value)
    expect(response.isPublic).toBe(snippet.isPublic.value)
    expect(response.author.id).toBe(snippet.author.id.value)
  })
})
