import { mock, type Mock } from 'ts-jest-mocker'

import type {
  SolutionsRepository,
  ChallengesRepository,
} from '#challenging/interfaces/index'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { SolutionsFaker } from '#challenging/domain/entities/fakers/SolutionsFaker'
import { PostSolutionUseCase } from '../PostSolutionUseCase'
import { SolutionTitleAlreadyInUseError } from '#challenging/domain/errors/SolutionTitleAlreadyInUseError'
import { ChallengeNotFoundError } from '#challenging/domain/errors/ChallengeNotFoundError'
import { Solution } from '#challenging/domain/entities/Solution'

describe('Post Solution Use Case', () => {
  let solutionsRepository: Mock<SolutionsRepository>
  let challengesRepository: Mock<ChallengesRepository>
  let useCase: PostSolutionUseCase

  beforeEach(() => {
    challengesRepository = mock<ChallengesRepository>()
    challengesRepository.findBySlug.mockImplementation()

    solutionsRepository = mock<SolutionsRepository>()
    solutionsRepository.findBySlug.mockImplementation()
    solutionsRepository.add.mockImplementation()

    useCase = new PostSolutionUseCase(solutionsRepository, challengesRepository)
  })

  it('should throw an error if the solution title is already in use', () => {
    const solution = SolutionsFaker.fake()
    const challenge = ChallengesFaker.fake()
    solutionsRepository.findBySlug.mockResolvedValue(solution)

    expect(
      useCase.execute({
        solutionTitle: solution.title.value,
        solutionContent: solution.content.value,
        authorId: solution.author.id.value,
        challengeId: challenge.id.value,
      }),
    ).rejects.toThrow(SolutionTitleAlreadyInUseError)
  })

  it('should throw an error if the challenge does not exist', () => {
    const solution = SolutionsFaker.fake()
    const challenge = ChallengesFaker.fake()
    solutionsRepository.findBySlug.mockResolvedValue(null)
    challengesRepository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({
        solutionTitle: solution.title.value,
        solutionContent: solution.content.value,
        authorId: solution.author.id.value,
        challengeId: challenge.id.value,
      }),
    ).rejects.toThrow(ChallengeNotFoundError)
  })

  it('should add a solution to the repository', async () => {
    const solution = SolutionsFaker.fake()
    const challenge = ChallengesFaker.fake()
    solutionsRepository.findBySlug.mockResolvedValue(null)
    challengesRepository.findById.mockResolvedValue(challenge)

    await useCase.execute({
      solutionTitle: solution.title.value,
      solutionContent: solution.content.value,
      authorId: solution.author.id.value,
      challengeId: challenge.id.value,
    })

    expect(solutionsRepository.add).toHaveBeenCalledWith(
      expect.any(Solution),
      challenge.id,
    )
  })

  it('should return the posted solution dto', async () => {
    const solution = SolutionsFaker.fake()
    const challenge = ChallengesFaker.fake()
    solutionsRepository.findBySlug.mockResolvedValue(null)
    challengesRepository.findById.mockResolvedValue(challenge)

    const response = await useCase.execute({
      solutionTitle: solution.title.value,
      solutionContent: solution.content.value,
      authorId: solution.author.id.value,
      challengeId: challenge.id.value,
    })

    expect(response.content).toEqual(solution.content.value)
    expect(response.title).toEqual(solution.title.value)
    expect(response.author.id).toEqual(solution.author.id.value)
  })
})
