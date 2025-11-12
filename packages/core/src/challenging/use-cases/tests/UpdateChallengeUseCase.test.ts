import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { ChallengeNotFoundError } from '#challenging/domain/errors/ChallengeNotFoundError'
import { ChallengeAlreadyExistsError } from '#challenging/domain/errors/ChallengeAlreadyExistsError'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { UpdateChallengeUseCase } from '../UpdateChallengeUseCase'

describe('Update Challenge Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: UpdateChallengeUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.findById.mockImplementation()
    repository.findBySlug.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new UpdateChallengeUseCase(repository)
  })

  it('should throw an error the challenge does not exist', async () => {
    const challenge = ChallengesFaker.fake()
    repository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({
        challengeDto: challenge.dto,
      }),
    ).rejects.toThrow(ChallengeNotFoundError)
  })

  it('should throw an error if the challenge title is already in use', async () => {
    const challenge = ChallengesFaker.fake()
    repository.findById.mockResolvedValue(
      ChallengesFaker.fake({ title: 'my other title' }),
    )
    repository.findBySlug.mockResolvedValue(challenge)

    expect(
      useCase.execute({
        challengeDto: challenge.dto,
      }),
    ).rejects.toThrow(ChallengeAlreadyExistsError)
  })

  it('should replace the challenge in the repository', async () => {
    const challenge = ChallengesFaker.fake()
    repository.findById.mockResolvedValue(challenge)

    await useCase.execute({
      challengeDto: challenge.dto,
    })

    expect(repository.replace).toHaveBeenCalledWith(challenge)
  })
})
