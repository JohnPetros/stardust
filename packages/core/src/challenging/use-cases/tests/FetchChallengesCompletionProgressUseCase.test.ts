import { mock, type Mock } from 'ts-jest-mocker'

import { Id } from '#global/domain/structures/Id'
import { Integer } from '#global/domain/structures/Integer'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { FetchChallengesCompletionProgressUseCase } from '../FetchChallengesCompletionProgressUseCase'

describe('Fetch Challenges Completion Progress Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: FetchChallengesCompletionProgressUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.countPublicChallenges.mockImplementation()

    useCase = new FetchChallengesCompletionProgressUseCase(repository)
  })

  it('should calculate the completed challenges count and return the completion dto', async () => {
    const firstChallengeId = Id.create().value
    const secondChallengeId = Id.create().value

    repository.countPublicChallenges.mockResolvedValue(Integer.create(12))

    const response = await useCase.execute({
      userCompletedChallengesIds: [
        firstChallengeId,
        secondChallengeId,
        secondChallengeId,
      ],
    })

    expect(repository.countPublicChallenges).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      completedChallengesCount: 2,
      totalChallengesCount: 12,
    })
  })
})
