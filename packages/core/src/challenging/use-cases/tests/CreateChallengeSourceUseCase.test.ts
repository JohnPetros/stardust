import { mock, type Mock } from 'ts-jest-mocker'

import { CreateChallengeSourceUseCase } from '../CreateChallengeSourceUseCase'
import type { ChallengeSourcesRepository } from '#challenging/interfaces/ChallengeSourcesRepository'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import {
  ChallengeNotFoundError,
  ChallengeSourceAlreadyExistsError,
} from '#challenging/domain/errors/index'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { ChallengeSourcesFaker } from '#challenging/domain/entities/fakers/ChallengeSourcesFaker'

describe('Create Challenge Source Use Case', () => {
  let useCase: CreateChallengeSourceUseCase
  let challengeSourcesRepository: Mock<ChallengeSourcesRepository>
  let challengesRepository: Mock<ChallengesRepository>

  beforeEach(() => {
    challengeSourcesRepository = mock<ChallengeSourcesRepository>()
    challengesRepository = mock<ChallengesRepository>()
    challengeSourcesRepository.findByChallengeId.mockImplementation()
    challengeSourcesRepository.findAll.mockImplementation()
    challengeSourcesRepository.add.mockImplementation()
    challengesRepository.findById.mockImplementation()

    useCase = new CreateChallengeSourceUseCase(
      challengeSourcesRepository,
      challengesRepository,
    )
  })

  it('should throw an error when challenge is not found', async () => {
    const challengeId = ChallengesFaker.fake().id.value
    challengesRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ challengeId, url: 'https://example.com' }),
    ).rejects.toThrow(ChallengeNotFoundError)
  })

  it('should throw an error when challenge source already exists for challenge', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeSource = ChallengeSourcesFaker.fake({
      challenge: {
        id: challenge.id.value,
        title: challenge.title.value,
        slug: challenge.slug.value,
      },
    })
    challengesRepository.findById.mockResolvedValue(challenge)
    challengeSourcesRepository.findByChallengeId.mockResolvedValue(challengeSource)

    await expect(
      useCase.execute({
        challengeId: challenge.id.value,
        url: 'https://example.com/new-source',
      }),
    ).rejects.toThrow(ChallengeSourceAlreadyExistsError)
  })

  it('should create challenge source with the next available position', async () => {
    const challenge = ChallengesFaker.fake()
    const existingSources = [
      ChallengeSourcesFaker.fake({ position: 5 }),
      ChallengeSourcesFaker.fake({ position: 2 }),
      ChallengeSourcesFaker.fake({ position: 9 }),
    ]
    const url = 'https://example.com/challenge-source'

    challengesRepository.findById.mockResolvedValue(challenge)
    challengeSourcesRepository.findByChallengeId.mockResolvedValue(null)
    challengeSourcesRepository.findAll.mockResolvedValue(existingSources)

    const response = await useCase.execute({
      challengeId: challenge.id.value,
      url,
    })

    expect(challengesRepository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: challenge.id.value }),
    )
    expect(challengeSourcesRepository.findByChallengeId).toHaveBeenCalledWith(
      expect.objectContaining({ value: challenge.id.value }),
    )
    expect(challengeSourcesRepository.add).toHaveBeenCalledTimes(1)

    const [createdChallengeSource] = challengeSourcesRepository.add.mock.calls[0]
    expect(createdChallengeSource.url.value).toBe(url)
    expect(createdChallengeSource.position.value).toBe(10)
    expect(createdChallengeSource.isUsed.value).toBe(false)
    expect(createdChallengeSource.challenge?.id.value).toBe(challenge.id.value)
    expect(createdChallengeSource.challenge?.title.value).toBe(challenge.title.value)
    expect(createdChallengeSource.challenge?.slug.value).toBe(challenge.slug.value)
    expect(response).toEqual(createdChallengeSource.dto)
  })
})
