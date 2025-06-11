import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { Id } from '#global/domain/structures/Id'
import { ChallengeNotFoundError } from '#challenging/domain/errors/ChallengeNotFoundError'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/index'
import { ChallengeVote } from '#challenging/domain/structures/ChallengeVote'
import { VoteChallengeUseCase } from '../VoteChallengeUseCase'

describe('Vote Challenge Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: VoteChallengeUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.findById.mockImplementation()
    repository.findVoteByChallengeAndUser.mockImplementation()
    repository.removeVote.mockImplementation()
    repository.replaceVote.mockImplementation()
    repository.addVote.mockImplementation()

    useCase = new VoteChallengeUseCase(repository)
  })

  it('should throw an error if challenge is not found', async () => {
    expect(
      useCase.execute({
        challengeId: Id.create().value,
        userId: Id.create().value,
        challengeVote: 'upvote',
      }),
    ).rejects.toThrow(ChallengeNotFoundError)
  })

  it('should remove the current vote from the repository if the challenge is already voted and the vote is the same', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeVote = ChallengeVote.createAsUpvote()
    const userId = Id.create()
    repository.findById.mockResolvedValue(challenge)
    repository.findVoteByChallengeAndUser.mockResolvedValue(challengeVote)

    await useCase.execute({
      challengeId: challenge.id.value,
      challengeVote: challengeVote.value,
      userId: userId.value,
    })

    expect(repository.removeVote).toHaveBeenCalledWith(challenge.id, userId)
  })

  it('should replace the current vote in the repository if the challenge is already voted and the vote is different', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeVote = ChallengeVote.createAsUpvote()
    const userChallengeVote = ChallengeVote.createAsDownvote()
    const userId = Id.create()
    repository.findById.mockResolvedValue(challenge)
    repository.findVoteByChallengeAndUser.mockResolvedValue(challengeVote)

    await useCase.execute({
      challengeId: challenge.id.value,
      challengeVote: userChallengeVote.value,
      userId: userId.value,
    })

    expect(repository.replaceVote).toHaveBeenCalledWith(
      challenge.id,
      userId,
      userChallengeVote,
    )
  })

  it('should add the current vote in the repository if the challenge is not voted and the vote is different', async () => {
    const challenge = ChallengesFaker.fake()
    const userChallengeVote = ChallengeVote.createAsUpvote()
    const userId = Id.create()
    repository.findById.mockResolvedValue(challenge)
    repository.findVoteByChallengeAndUser.mockResolvedValue(ChallengeVote.createAsNone())

    await useCase.execute({
      challengeId: challenge.id.value,
      challengeVote: userChallengeVote.value,
      userId: userId.value,
    })

    expect(repository.addVote).toHaveBeenCalledWith(
      challenge.id,
      userId,
      userChallengeVote,
    )
  })

  it('should vote the challenge', async () => {
    const challenge = ChallengesFaker.fake()
    const userChallengeVote = ChallengeVote.createAsUpvote()
    const userId = Id.create()
    challenge.vote = jest.fn()
    repository.findById.mockResolvedValue(challenge)
    repository.findVoteByChallengeAndUser.mockResolvedValue(ChallengeVote.createAsNone())

    await useCase.execute({
      challengeId: challenge.id.value,
      challengeVote: userChallengeVote.value,
      userId: userId.value,
    })

    expect(challenge.vote).toHaveBeenCalledWith(userChallengeVote)
  })

  it('should return the user challenge vote, count of upvotes and downvotes after vote the challenge', async () => {
    const challenge = ChallengesFaker.fake()
    const userChallengeVote = ChallengeVote.createAsUpvote()
    const userId = Id.create()
    challenge.vote = jest.fn()
    repository.findById.mockResolvedValue(challenge)
    repository.findVoteByChallengeAndUser.mockResolvedValue(ChallengeVote.createAsNone())

    const response = await useCase.execute({
      challengeId: challenge.id.value,
      challengeVote: userChallengeVote.value,
      userId: userId.value,
    })

    challenge.vote(userChallengeVote)

    expect(response.downvotesCount).toBe(challenge.downvotesCount.value)
    expect(response.upvotesCount).toBe(challenge.upvotesCount.value)
    expect(response.userChallengeVote).toBe(challenge.userVote.value)
  })
})
