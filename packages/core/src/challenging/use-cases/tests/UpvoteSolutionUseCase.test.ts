import type { SolutionsRepository } from '#challenging/interfaces/index'
import { mock, type Mock } from 'ts-jest-mocker'
import { UpvoteSolutionUseCase } from '../UpvoteSolutionUseCase'
import { SolutionNotFoundError } from '#challenging/domain/errors/SolutionNotFoundError'
import { SolutionsFaker } from '#challenging/domain/entities/fakers/SolutionsFaker'

describe('Upvote Solution Use Case', () => {
  let repository: Mock<SolutionsRepository>
  let useCase: UpvoteSolutionUseCase

  beforeEach(() => {
    repository = mock<SolutionsRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    repository.removeSolutionUpvote.mockImplementation()
    repository.addSolutionUpvote.mockImplementation()

    useCase = new UpvoteSolutionUseCase(repository)
  })

  it('should throw an error if the solution does not exist', () => {
    expect(
      useCase.execute({
        solutionId: '',
        userId: '',
        isSolutionUpvoted: false,
      }),
    ).rejects.toThrow(SolutionNotFoundError)
  })

  it('should remove the solution upvote if the solution is already upvoted', async () => {
    const solution = SolutionsFaker.fake()
    solution.upvote = jest.fn()
    solution.removeUpvote = jest.fn()
    repository.findById.mockResolvedValue(solution)

    await useCase.execute({
      solutionId: solution.id.value,
      userId: solution.author.id.value,
      isSolutionUpvoted: true,
    })

    expect(solution.removeUpvote).toHaveBeenCalled()
    expect(repository.removeSolutionUpvote).toHaveBeenCalledWith(
      solution.id,
      solution.author.id,
    )
    expect(solution.upvote).not.toHaveBeenCalled()
    expect(repository.addSolutionUpvote).not.toHaveBeenCalled()
  })
})
