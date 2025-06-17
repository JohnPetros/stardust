import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { ChallengeNotFoundError } from '#challenging/domain/errors/ChallengeNotFoundError'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/index'
import { GetChallengeUseCase } from '../GetChallengeUseCase'

describe('Get Challenge Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: GetChallengeUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.findBySlug.mockImplementation()

    useCase = new GetChallengeUseCase(repository)
  })

  it('should throw an error if the challenge is not found', async () => {
    const challenge = ChallengesFaker.fake()
    expect(
      useCase.execute({
        challengeSlug: challenge.slug.value,
      }),
    ).rejects.toThrow(ChallengeNotFoundError)
  })

  it('should return the dto of the challenge found by slug', async () => {
    const challenge = ChallengesFaker.fake()
    repository.findBySlug.mockResolvedValue(challenge)

    const response = await useCase.execute({
      challengeSlug: challenge.slug.value,
    })

    expect(repository.findBySlug).toHaveBeenCalledWith(challenge.slug)
    expect(response).toEqual(challenge.dto)
  })
})
