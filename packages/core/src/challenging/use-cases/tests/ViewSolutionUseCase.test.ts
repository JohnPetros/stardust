import { mock, type Mock } from 'ts-jest-mocker'

import type { SolutionsRepository } from '#challenging/interfaces/index'
import { SolutionNotFoundError } from '#challenging/domain/errors/SolutionNotFoundError'
import { SolutionsFaker } from '#challenging/domain/entities/fakers/SolutionsFaker'
import { ViewSolutionUseCase } from '../ViewSolutionUseCase'

describe('View Solution Use Case', () => {
  let repository: Mock<SolutionsRepository>
  let useCase: ViewSolutionUseCase

  beforeEach(() => {
    repository = mock<SolutionsRepository>()
    repository.findBySlug.mockImplementation()
    repository.replace.mockImplementation()

    useCase = new ViewSolutionUseCase(repository)
  })

  it('should throw an error if the solution does not exist', () => {
    expect(useCase.execute({ solutionSlug: 'fake-slug' })).rejects.toThrow(
      SolutionNotFoundError,
    )
  })

  it('should view the solution', async () => {
    const solution = SolutionsFaker.fake()
    solution.view = jest.fn()
    repository.findBySlug.mockResolvedValue(solution)

    await useCase.execute({ solutionSlug: solution.slug.value })

    expect(solution.view).toHaveBeenCalledTimes(1)
  })

  it('should replace the solution in the repository', async () => {
    const solution = SolutionsFaker.fake()
    repository.findBySlug.mockResolvedValue(solution)

    await useCase.execute({ solutionSlug: solution.slug.value })

    expect(repository.replace).toHaveBeenCalledWith(solution)
  })

  it('should return the solution dto', async () => {
    const solution = SolutionsFaker.fake()
    repository.findBySlug.mockResolvedValue(solution)

    const response = await useCase.execute({ solutionSlug: solution.slug.value })

    expect(response).toEqual(solution.dto)
  })
})
