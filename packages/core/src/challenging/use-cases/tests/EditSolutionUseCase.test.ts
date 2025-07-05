import { mock, type Mock } from 'ts-jest-mocker'

import type { SolutionsRepository } from '#challenging/interfaces/index'
import { SolutionNotFoundError } from '#challenging/domain/errors/SolutionNotFoundError'
import { SolutionsFaker } from '#challenging/domain/entities/fakers/SolutionsFaker'
import { SolutionTitleAlreadyInUseError } from '#challenging/domain/errors/SolutionTitleAlreadyInUseError'
import { EditSolutionUseCase } from '../EditSolutionUseCase'

describe('Edit Solution Use Case', () => {
  let repository: Mock<SolutionsRepository>
  let useCase: EditSolutionUseCase

  beforeEach(() => {
    repository = mock<SolutionsRepository>()
    repository.findById.mockImplementation()
    repository.findBySlug.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new EditSolutionUseCase(repository)
  })

  it('should throw an error if the solution does not exist', () => {
    expect(
      useCase.execute({
        solutionId: '',
        solutionTitle: '',
        solutionContent: '',
      }),
    ).rejects.toThrow(SolutionNotFoundError)
  })

  it('should throw an error if the solution title is already in use', () => {
    const solution = SolutionsFaker.fake()
    repository.findById.mockResolvedValue(solution)
    repository.findBySlug.mockResolvedValue(solution)
    const newSolutionTitle = 'new-solution-title'

    expect(
      useCase.execute({
        solutionId: solution.id.value,
        solutionTitle: newSolutionTitle,
        solutionContent: solution.content.value,
      }),
    ).rejects.toThrow(SolutionTitleAlreadyInUseError)
  })

  it('should set the solution title and content', async () => {
    const solution = SolutionsFaker.fake()
    const solutionTitle = 'fake-title'
    const solutionContent = 'fake-content'
    repository.findById.mockResolvedValue(solution)

    await useCase.execute({
      solutionId: solution.id.value,
      solutionTitle,
      solutionContent,
    })

    expect(solution.title.value).toEqual(solutionTitle)
    expect(solution.content.value).toEqual(solutionContent)
  })

  it('should replace the solution in the repository', async () => {
    const solution = SolutionsFaker.fake()
    const solutionTitle = 'fake-title'
    const solutionContent = 'fake-content'
    repository.findById.mockResolvedValue(solution)

    await useCase.execute({
      solutionId: solution.id.value,
      solutionTitle,
      solutionContent,
    })

    expect(repository.replace).toHaveBeenCalledWith(solution)
  })

  it('should return the solution dto', async () => {
    const solution = SolutionsFaker.fake()
    const solutionTitle = 'fake-title'
    const solutionContent = 'fake-content'
    solution.title = solutionTitle
    solution.content = solutionContent
    repository.findById.mockResolvedValue(solution)

    const response = await useCase.execute({
      solutionId: solution.id.value,
      solutionTitle,
      solutionContent,
    })

    expect(response).toEqual(solution.dto)
  })
})
