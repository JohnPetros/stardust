import { mock, type Mock } from 'ts-jest-mocker'

import { SnippetsFaker } from '#playground/domain/entities/fakers/SnippetsFaker'
import { SnippetNotFoundError } from '#playground/domain/errors/SnippetNotFoundError'
import type { SnippetsRepository } from '../../interfaces'
import { EditSnippetTitleUseCase } from '../EditSnippetTitleUseCase'

describe('Edit Snippet Title Use Case', () => {
  let repository: Mock<SnippetsRepository>
  let useCase: EditSnippetTitleUseCase

  beforeEach(() => {
    repository = mock<SnippetsRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new EditSnippetTitleUseCase(repository)
  })

  it('should throw an error if the snippet is not found', async () => {
    const snippet = SnippetsFaker.fake()
    repository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({
        snippetId: snippet.id.value,
        snippetTitle: 'New Title',
      }),
    ).rejects.toThrow(SnippetNotFoundError)
  })
})
