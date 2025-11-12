import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { PostChallengeUseCase } from '../PostChallengeUseCase'
import { ChallengeAlreadyExistsError } from '#challenging/domain/errors/ChallengeAlreadyExistsError'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'

describe('Post Challenge Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: PostChallengeUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.findBySlug.mockImplementation()
    repository.add.mockImplementation()
    useCase = new PostChallengeUseCase(repository)
  })

  it('should throw an error if the challenge title is already in use', async () => {
    const challenge = ChallengesFaker.fake()
    repository.findBySlug.mockResolvedValue(challenge)

    expect(
      useCase.execute({
        challengeDto: challenge.dto,
      }),
    ).rejects.toThrow(ChallengeAlreadyExistsError)
  })

  it('should add the challenge to the repository', async () => {
    const challenge = ChallengesFaker.fake()
    repository.findBySlug.mockResolvedValue(null)

    await useCase.execute({
      challengeDto: challenge.dto,
    })

    expect(repository.add).toHaveBeenCalledWith(challenge)
  })
})
