import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { ChallengeNotFoundError } from '#challenging/domain/errors/ChallengeNotFoundError'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/index'
import { GetChallengeVoteUseCase } from '../GetChallengeVoteUseCase'
import { Id } from '#global/domain/structures/Id'
import { ChallengeVote } from '#challenging/domain/structures/ChallengeVote'

describe('Get Challenge Vote Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: GetChallengeVoteUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.findById.mockImplementation()
    repository.findVoteByChallengeAndUser.mockImplementation()

    useCase = new GetChallengeVoteUseCase(repository)
  })

  it('should throw an error if the challenge is not found', async () => {
    const challenge = ChallengesFaker.fake()
    const userId = Id.create()
    expect(
      useCase.execute({
        challengeId: challenge.id.value,
        userId: userId.value,
      }),
    ).rejects.toThrow(ChallengeNotFoundError)
  })

  it('should return the value of the challenge vote found by id and user', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeVote = ChallengeVote.createAsUpvote()
    const userId = Id.create()
    repository.findById.mockResolvedValue(challenge)
    repository.findVoteByChallengeAndUser.mockResolvedValue(challengeVote)

    const response = await useCase.execute({
      challengeId: challenge.id.value,
      userId: userId.value,
    })

    expect(repository.findById).toHaveBeenCalledWith(challenge.id)
    expect(repository.findVoteByChallengeAndUser).toHaveBeenCalledWith(
      challenge.id,
      userId,
    )
    expect(response.challengeVote).toEqual(challengeVote.value)
  })
})
