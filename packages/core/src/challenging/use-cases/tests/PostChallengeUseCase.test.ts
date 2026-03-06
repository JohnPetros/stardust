import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { ChallengeSourcesFaker } from '#challenging/domain/entities/fakers/ChallengeSourcesFaker'
import { PostChallengeUseCase } from '../PostChallengeUseCase'
import { ChallengeAlreadyExistsError } from '#challenging/domain/errors/ChallengeAlreadyExistsError'
import { ChallengeSourceNotFoundError } from '#challenging/domain/errors/ChallengeSourceNotFoundError'
import { ChallengePostedEvent } from '#challenging/domain/events/ChallengePostedEvent'
import type { ChallengeSourcesRepository } from '#challenging/interfaces/ChallengeSourcesRepository'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import type { Broker } from '#global/interfaces/Broker'

describe('Post Challenge Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let challengeSourcesRepository: Mock<ChallengeSourcesRepository>
  let broker: Mock<Broker>
  let useCase: PostChallengeUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    challengeSourcesRepository = mock<ChallengeSourcesRepository>()
    broker = mock<Broker>()
    repository.findBySlug.mockImplementation()
    repository.add.mockImplementation()
    challengeSourcesRepository.findById.mockImplementation()
    challengeSourcesRepository.replace.mockImplementation()
    broker.publish.mockImplementation()
    useCase = new PostChallengeUseCase(repository, challengeSourcesRepository, broker)
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

  it('should link challenge source when challengeSourceId is provided', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeSource = ChallengeSourcesFaker.fake({ challenge: null })

    repository.findBySlug.mockResolvedValue(null)
    challengeSourcesRepository.findById.mockResolvedValue(challengeSource)

    await useCase.execute({
      challengeDto: challenge.dto,
      challengeSourceId: challengeSource.id.value,
    })

    expect(challengeSourcesRepository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: challengeSource.id.value }),
    )
    expect(challengeSource.challenge?.id.value).toBe(challenge.id.value)
    expect(challengeSource.challenge?.title.value).toBe(challenge.title.value)
    expect(challengeSource.challenge?.slug.value).toBe(challenge.slug.value)
    expect(challengeSourcesRepository.replace).toHaveBeenCalledWith(challengeSource)
  })

  it('should throw when challengeSourceId is provided but source is not found', async () => {
    const challenge = ChallengesFaker.fake()

    repository.findBySlug.mockResolvedValue(null)
    challengeSourcesRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        challengeDto: challenge.dto,
        challengeSourceId: '550e8400-e29b-41d4-a716-446655440100',
      }),
    ).rejects.toThrow(ChallengeSourceNotFoundError)

    expect(challengeSourcesRepository.replace).not.toHaveBeenCalled()
  })
})
