import { mock, type Mock } from 'ts-jest-mocker'

import { SnippetsFaker } from '#playground/domain/entities/fakers/SnippetsFaker'
import { SnippetNotFoundError } from '#playground/domain/errors/SnippetNotFoundError'
import type { SnippetsRepository } from '../../interfaces'
import { EditSnippetUseCase } from '../EditSnippetUseCase'

describe('Edit Snippet Use Case', () => {
  let repository: Mock<SnippetsRepository>
  let useCase: EditSnippetUseCase

  beforeEach(() => {
    repository = mock<SnippetsRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new EditSnippetUseCase(repository)
  })

  it('should throw an error if the snippet is not found', async () => {
    const snippet = SnippetsFaker.fake()
    repository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({
        snippetId: snippet.id.value,
        snippetTitle: snippet.title.value,
        snippetCode: snippet.code.value,
      }),
    ).rejects.toThrow(SnippetNotFoundError)
  })

  it('should replace the snippet in the repository with the new title and code', async () => {
    const snippet = SnippetsFaker.fake()
    repository.findById.mockResolvedValue(snippet)
    const newTitle = 'New Title'
    const newCode = 'New Code'

    await useCase.execute({
      snippetId: snippet.id.value,
      snippetTitle: newTitle,
      snippetCode: newCode,
    })

    snippet.title = newTitle
    snippet.code = newCode

    expect(repository.replace).toHaveBeenCalledTimes(1)
    expect(repository.replace).toHaveBeenCalledWith(snippet)
  })

  it('should return the updated snippet', async () => {
    const snippet = SnippetsFaker.fake()
    repository.findById.mockResolvedValue(snippet)
    const newTitle = 'New Title'
    const newCode = 'New Code'

    const response = await useCase.execute({
      snippetId: snippet.id.value,
      snippetTitle: newTitle,
      snippetCode: newCode,
    })

    snippet.title = newTitle
    snippet.code = newCode

    expect(response.title).toBe(newTitle)
    expect(response.code).toBe(newCode)
  })
})
