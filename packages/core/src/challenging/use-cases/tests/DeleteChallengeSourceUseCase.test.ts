import { mock, type Mock } from 'ts-jest-mocker'

import { DeleteChallengeSourceUseCase } from '../DeleteChallengeSourceUseCase'
import type { ChallengeSourcesRepository } from '#challenging/interfaces/ChallengeSourcesRepository'
import { ChallengeSourceNotFoundError } from '#challenging/domain/errors/ChallengeSourceNotFoundError'
import { ChallengeSourcesFaker } from '#challenging/domain/entities/fakers/ChallengeSourcesFaker'

describe('Delete Challenge Source Use Case', () => {
  let useCase: DeleteChallengeSourceUseCase
  let repository: Mock<ChallengeSourcesRepository>

  beforeEach(() => {
    repository = mock<ChallengeSourcesRepository>()
    repository.findById.mockImplementation()
    repository.remove.mockImplementation()

    useCase = new DeleteChallengeSourceUseCase(repository)
  })

  it('should throw an error when challenge source does not exist', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        challengeSourceId: ChallengeSourcesFaker.fake().id.value,
      }),
    ).rejects.toThrow(ChallengeSourceNotFoundError)
  })

  it('should remove challenge source when it exists', async () => {
    const challengeSource = ChallengeSourcesFaker.fake()
    repository.findById.mockResolvedValue(challengeSource)

    await useCase.execute({
      challengeSourceId: challengeSource.id.value,
    })

    expect(repository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: challengeSource.id.value }),
    )
    expect(repository.remove).toHaveBeenCalledWith(
      expect.objectContaining({ value: challengeSource.id.value }),
    )
  })
})
