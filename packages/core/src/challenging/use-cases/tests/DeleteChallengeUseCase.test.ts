import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { ChallengeNotFoundError } from '#challenging/domain/errors/ChallengeNotFoundError'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { DeleteChallengeUseCase } from '../DeleteChallengeUseCase'

describe('Delete challenge use case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: DeleteChallengeUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.findById.mockImplementation()
    repository.remove.mockImplementation()

    useCase = new DeleteChallengeUseCase(repository)
  })

  it('should throw an error if the challenge does not exist', () => {
    expect(useCase.execute({ challengeId: '' })).rejects.toThrow(ChallengeNotFoundError)
  })

  it('should remove the challenge from the repository', async () => {
    const challenge = ChallengesFaker.fake()
    repository.findById.mockResolvedValue(challenge)

    await useCase.execute({ challengeId: challenge.id.value })

    expect(repository.remove).toHaveBeenCalledWith(challenge)
  })
})
