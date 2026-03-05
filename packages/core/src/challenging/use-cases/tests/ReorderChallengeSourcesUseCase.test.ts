import { mock, type Mock } from 'ts-jest-mocker'

import { ReorderChallengeSourcesUseCase } from '../ReorderChallengeSourcesUseCase'
import type { ChallengeSourcesRepository } from '#challenging/interfaces/ChallengeSourcesRepository'
import { ChallengeSourceNotFoundError } from '#challenging/domain/errors/ChallengeSourceNotFoundError'
import { ConflictError } from '#global/domain/errors/ConflictError'
import { ChallengeSourcesFaker } from '#challenging/domain/entities/fakers/ChallengeSourcesFaker'

describe('Reorder Challenge Sources Use Case', () => {
  let useCase: ReorderChallengeSourcesUseCase
  let repository: Mock<ChallengeSourcesRepository>

  beforeEach(() => {
    repository = mock<ChallengeSourcesRepository>()
    repository.findAll.mockImplementation()
    repository.replaceMany.mockImplementation()

    useCase = new ReorderChallengeSourcesUseCase(repository)
  })

  it('should throw conflict error when no challenge source ids are provided', async () => {
    repository.findAll.mockResolvedValue([])

    await expect(useCase.execute({ challengeSourceIds: [] })).rejects.toThrow(
      ConflictError,
    )
  })

  it('should throw conflict error when duplicate challenge source ids are provided', async () => {
    const challengeSource = ChallengeSourcesFaker.fake()
    repository.findAll.mockResolvedValue([challengeSource])

    await expect(
      useCase.execute({
        challengeSourceIds: [challengeSource.id.value, challengeSource.id.value],
      }),
    ).rejects.toThrow(ConflictError)
  })

  it('should throw challenge source not found error when any id does not exist', async () => {
    const challengeSource = ChallengeSourcesFaker.fake()
    repository.findAll.mockResolvedValue([challengeSource])

    await expect(
      useCase.execute({
        challengeSourceIds: [
          challengeSource.id.value,
          ChallengeSourcesFaker.fake().id.value,
        ],
      }),
    ).rejects.toThrow(ChallengeSourceNotFoundError)
  })

  it('should reorder challenge sources preserving available positions in sorted order', async () => {
    const sourceA = ChallengeSourcesFaker.fake({ position: 30 })
    const sourceB = ChallengeSourcesFaker.fake({ position: 10 })
    const sourceC = ChallengeSourcesFaker.fake({ position: 20 })

    repository.findAll.mockResolvedValue([sourceA, sourceB, sourceC])

    const response = await useCase.execute({
      challengeSourceIds: [sourceC.id.value, sourceA.id.value, sourceB.id.value],
    })

    expect(repository.findAll).toHaveBeenCalledTimes(1)
    expect(repository.replaceMany).toHaveBeenCalledTimes(1)

    const [reorderedChallengeSources] = repository.replaceMany.mock.calls[0]
    expect(reorderedChallengeSources).toHaveLength(3)
    expect(reorderedChallengeSources[0].id.value).toBe(sourceC.id.value)
    expect(reorderedChallengeSources[0].position.value).toBe(10)
    expect(reorderedChallengeSources[1].id.value).toBe(sourceA.id.value)
    expect(reorderedChallengeSources[1].position.value).toBe(20)
    expect(reorderedChallengeSources[2].id.value).toBe(sourceB.id.value)
    expect(reorderedChallengeSources[2].position.value).toBe(30)

    expect(response).toEqual(
      reorderedChallengeSources.map((challengeSource) => challengeSource.dto),
    )
  })
})
