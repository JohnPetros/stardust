import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { ChallengeIsAlreadyStarError } from '#challenging/domain/errors/index'
import { ChallengeNotFoundError } from '#challenging/domain/errors/ChallengeNotFoundError'
import { ChallengeStarAlreadyInUseError } from '#challenging/domain/errors/ChallengeStarAlreadyInUseError'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { EditChallengeStarUseCase } from '../EditChallengeStarUseCase'

describe('Edit Challenge Star Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: EditChallengeStarUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.findById.mockImplementation()
    repository.findByStar.mockImplementation()
    repository.replace.mockImplementation()

    useCase = new EditChallengeStarUseCase(repository)
  })

  it('should throw an error if the challenge does not exist', async () => {
    const challenge = ChallengesFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        challengeId: challenge.id.value,
        starId: challenge.id.value,
      }),
    ).rejects.toThrow(ChallengeNotFoundError)
  })

  it('should throw an error if the challenge is already a star challenge', async () => {
    const challenge = ChallengesFaker.fake({ starId: ChallengesFaker.fake().id.value })
    repository.findById.mockResolvedValue(challenge)

    await expect(
      useCase.execute({
        challengeId: challenge.id.value,
        starId: ChallengesFaker.fake().id.value,
      }),
    ).rejects.toThrow(ChallengeIsAlreadyStarError)
  })

  it('should throw an error if another challenge already uses the star', async () => {
    const challenge = ChallengesFaker.fake({ starId: null })
    const starChallenge = ChallengesFaker.fake({
      starId: ChallengesFaker.fake().id.value,
    })
    const starId = ChallengesFaker.fake().id.value

    repository.findById.mockResolvedValue(challenge)
    repository.findByStar.mockResolvedValue(starChallenge)

    await expect(
      useCase.execute({
        challengeId: challenge.id.value,
        starId,
      }),
    ).rejects.toThrow(ChallengeStarAlreadyInUseError)
  })

  it('should edit challenge star and replace challenge in repository', async () => {
    const challenge = ChallengesFaker.fake({ starId: null })
    const starId = ChallengesFaker.fake().id.value

    repository.findById.mockResolvedValue(challenge)
    repository.findByStar.mockResolvedValue(null)

    const response = await useCase.execute({
      challengeId: challenge.id.value,
      starId,
    })

    expect(repository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: challenge.id.value }),
    )
    expect(repository.findByStar).toHaveBeenCalledWith(
      expect.objectContaining({ value: starId }),
    )
    expect(repository.replace).toHaveBeenCalledWith(challenge)
    expect(response.starId).toBe(starId)
  })
})
