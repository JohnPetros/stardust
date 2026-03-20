import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { ChallengeNotFoundError } from '#challenging/domain/errors/ChallengeNotFoundError'
import { ChallengeNavigation } from '#challenging/domain/structures/ChallengeNavigation'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/index'
import { GetChallengeNavigationUseCase } from '../GetChallengeNavigationUseCase'

describe('Get Challenge Navigation Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: GetChallengeNavigationUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.findChallengeNavigationBySlug.mockImplementation()

    useCase = new GetChallengeNavigationUseCase(repository)
  })

  it('should throw an error if challenge navigation is not found', async () => {
    const challenge = ChallengesFaker.fake()

    await expect(
      useCase.execute({
        challengeSlug: challenge.slug.value,
      }),
    ).rejects.toThrow(ChallengeNotFoundError)
  })

  it('should return challenge navigation dto', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeNavigation = ChallengeNavigation.create({
      previousChallengeSlug: 'challenge-1',
      nextChallengeSlug: 'challenge-3',
    })

    repository.findChallengeNavigationBySlug.mockResolvedValue(challengeNavigation)

    const response = await useCase.execute({
      challengeSlug: challenge.slug.value,
    })

    expect(repository.findChallengeNavigationBySlug).toHaveBeenCalledWith(challenge.slug)
    expect(response).toEqual(challengeNavigation.dto)
  })
})
