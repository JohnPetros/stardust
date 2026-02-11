import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { PostChallengeUseCase } from '../PostChallengeUseCase'
import { ChallengeAlreadyExistsError } from '#challenging/domain/errors/ChallengeAlreadyExistsError'
import { ChallengePostedEvent } from '#challenging/domain/events/ChallengePostedEvent'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import type { Broker } from '#global/interfaces/Broker'

describe('Post Challenge Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let broker: Mock<Broker>
  let useCase: PostChallengeUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    broker = mock<Broker>()
    repository.findBySlug.mockImplementation()
    repository.add.mockImplementation()
    broker.publish.mockImplementation()
    useCase = new PostChallengeUseCase(repository, broker)
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

  it('should publish ChallengePostedEvent after creating challenge', async () => {
    const challenge = ChallengesFaker.fake()
    repository.findBySlug.mockResolvedValue(null)

    await useCase.execute({
      challengeDto: challenge.dto,
    })

    expect(broker.publish).toHaveBeenCalledTimes(1)
    expect(broker.publish).toHaveBeenCalledWith(expect.any(ChallengePostedEvent))
    const event = broker.publish.mock.calls[0][0] as ChallengePostedEvent
    expect(event.payload.challengeSlug).toBe(challenge.slug.value)
    expect(event.payload.challengeTitle).toBe(challenge.title.value)
    expect(event.payload.challengeAuthor).toEqual(challenge.author.dto)
  })
})
