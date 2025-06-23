import { mock, type Mock } from 'ts-jest-mocker'

import type { SolutionsRepository } from '#challenging/interfaces/SolutionsRepository'
import { SolutionNotFoundError } from '#challenging/domain/errors/SolutionNotFoundError'
import { DeleteSolutionUseCase } from '../DeleteSolutionUseCase'
import { SolutionsFaker } from '#challenging/domain/entities/fakers/SolutionsFaker'

describe('Delete Solution Use Case', () => {
  let repository: Mock<SolutionsRepository>
  let useCase: DeleteSolutionUseCase

  beforeEach(() => {
    repository = mock<SolutionsRepository>()
    repository.findById.mockImplementation()
    repository.remove.mockImplementation()

    useCase = new DeleteSolutionUseCase(repository)
  })

  it('should throw an error if the solution does not exist', () => {
    expect(useCase.execute({ solutionId: '' })).rejects.toThrow(SolutionNotFoundError)
  })

  it('should remove the solution from the repository', async () => {
    const solution = SolutionsFaker.fake()
    repository.findById.mockResolvedValue(solution)

    await useCase.execute({ solutionId: solution.id.value })

    expect(repository.remove).toHaveBeenCalledWith(solution.id)
  })
})
