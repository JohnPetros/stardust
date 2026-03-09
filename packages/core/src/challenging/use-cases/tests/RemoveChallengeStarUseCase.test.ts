import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import {
  ChallengeIsNotStarChallengeError,
  ChallengeNotFoundError,
} from '#challenging/domain/errors/index'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { RemoveChallengeStarUseCase } from '../RemoveChallengeStarUseCase'

describe('Remove Challenge Star Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: RemoveChallengeStarUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()

    useCase = new RemoveChallengeStarUseCase(repository)
  })

  it('should throw an error if the challenge does not exist', async () => {
    const challenge = ChallengesFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        challengeId: challenge.id.value,
      }),
    ).rejects.toThrow(ChallengeNotFoundError)
  })

  it('should throw an error if challenge is not linked to a star', async () => {
    const challenge = ChallengesFaker.fake({ starId: null })
    repository.findById.mockResolvedValue(challenge)

    await expect(
      useCase.execute({
        challengeId: challenge.id.value,
      }),
    ).rejects.toThrow(ChallengeIsNotStarChallengeError)
  })

  it('should remove challenge star and replace challenge in repository', async () => {
    const challenge = ChallengesFaker.fake({ starId: ChallengesFaker.fake().id.value })
    repository.findById.mockResolvedValue(challenge)

    await useCase.execute({
      challengeId: challenge.id.value,
    })

    expect(repository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: challenge.id.value }),
    )
    expect(repository.replace).toHaveBeenCalledWith(challenge)
    expect(challenge.starId).toBeNull()
  })
})
