import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengeSourceNotFoundError } from '#challenging/domain/errors/ChallengeSourceNotFoundError'
import { ChallengeSourcesFaker } from '#challenging/domain/entities/fakers/ChallengeSourcesFaker'
import type { ChallengeSourcesRepository } from '#challenging/interfaces/ChallengeSourcesRepository'
import { GetNextChallengeSourceUseCase } from '../GetNextChallengeSourceUseCase'

describe('Get Next Challenge Source Use Case', () => {
  let repository: Mock<ChallengeSourcesRepository>
  let useCase: GetNextChallengeSourceUseCase

  beforeEach(() => {
    repository = mock<ChallengeSourcesRepository>()
    repository.findNextNotUsed.mockImplementation()

    useCase = new GetNextChallengeSourceUseCase(repository)
  })

  it('should throw an error when no next challenge source is found', async () => {
    await expect(useCase.execute()).rejects.toThrow(ChallengeSourceNotFoundError)
    expect(repository.findNextNotUsed).toHaveBeenCalledTimes(1)
  })

  it('should return the dto of the next not used challenge source', async () => {
    const challengeSource = ChallengeSourcesFaker.fake()
    repository.findNextNotUsed.mockResolvedValue(challengeSource)

    const response = await useCase.execute()

    expect(repository.findNextNotUsed).toHaveBeenCalledTimes(1)
    expect(response).toEqual(challengeSource.dto)
  })
})
