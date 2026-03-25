import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengeSourcesRepository } from '#challenging/interfaces/ChallengeSourcesRepository'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import {
  ChallengeNotFoundError,
  ChallengeSourceAlreadyExistsError,
  ChallengeSourceNotFoundError,
} from '#challenging/domain/errors/index'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { ChallengeSourcesFaker } from '#challenging/domain/entities/fakers/ChallengeSourcesFaker'
import { UpdateChallengeSourceUseCase } from '../UpdateChallengeSourceUseCase'

describe('Update Challenge Source Use Case', () => {
  let useCase: UpdateChallengeSourceUseCase
  let challengeSourcesRepository: Mock<ChallengeSourcesRepository>
  let challengesRepository: Mock<ChallengesRepository>

  beforeEach(() => {
    challengeSourcesRepository = mock<ChallengeSourcesRepository>()
    challengesRepository = mock<ChallengesRepository>()

    challengeSourcesRepository.findById.mockImplementation()
    challengeSourcesRepository.findByChallengeId.mockImplementation()
    challengeSourcesRepository.replace.mockImplementation()
    challengesRepository.findById.mockImplementation()

    useCase = new UpdateChallengeSourceUseCase(
      challengeSourcesRepository,
      challengesRepository,
    )
  })

  it('should throw an error when challenge source is not found', async () => {
    const challengeSourceId = '550e8400-e29b-41d4-a716-446655440100'

    challengeSourcesRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        challengeSourceId,
        url: 'https://example.com/source',
      }),
    ).rejects.toThrow(ChallengeSourceNotFoundError)

    expect(challengeSourcesRepository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: challengeSourceId }),
    )
    expect(challengeSourcesRepository.replace).not.toHaveBeenCalled()
  })

  it('should throw an error when challenge is not found', async () => {
    const challengeSource = ChallengeSourcesFaker.fake()

    challengeSourcesRepository.findById.mockResolvedValue(challengeSource)
    challengesRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        challengeSourceId: challengeSource.id.value,
        challengeId: '550e8400-e29b-41d4-a716-446655440101',
        url: 'https://example.com/source',
      }),
    ).rejects.toThrow(ChallengeNotFoundError)

    expect(challengesRepository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: '550e8400-e29b-41d4-a716-446655440101' }),
    )
    expect(challengeSourcesRepository.replace).not.toHaveBeenCalled()
  })

  it('should throw an error when another source already uses the challenge', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeSource = ChallengeSourcesFaker.fake({
      challenge: null,
    })
    const existingChallengeSource = ChallengeSourcesFaker.fake({
      challenge: {
        id: challenge.id.value,
        title: challenge.title.value,
        slug: challenge.slug.value,
      },
    })

    challengeSourcesRepository.findById.mockResolvedValue(challengeSource)
    challengesRepository.findById.mockResolvedValue(challenge)
    challengeSourcesRepository.findByChallengeId.mockResolvedValue(
      existingChallengeSource,
    )

    await expect(
      useCase.execute({
        challengeSourceId: challengeSource.id.value,
        challengeId: challenge.id.value,
        url: 'https://example.com/source',
      }),
    ).rejects.toThrow(ChallengeSourceAlreadyExistsError)

    expect(challengeSourcesRepository.findByChallengeId).toHaveBeenCalledWith(
      challenge.id,
    )
    expect(challengeSourcesRepository.replace).not.toHaveBeenCalled()
  })

  it('should update source when challenge already belongs to the same source', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeSource = ChallengeSourcesFaker.fake({
      challenge: null,
    })
    const existingChallengeSource = ChallengeSourcesFaker.fake({
      id: challengeSource.id.value,
      challenge: {
        id: challenge.id.value,
        title: challenge.title.value,
        slug: challenge.slug.value,
      },
    })

    challengeSourcesRepository.findById.mockResolvedValue(challengeSource)
    challengesRepository.findById.mockResolvedValue(challenge)
    challengeSourcesRepository.findByChallengeId.mockResolvedValue(
      existingChallengeSource,
    )

    const response = await useCase.execute({
      challengeSourceId: challengeSource.id.value,
      challengeId: challenge.id.value,
      url: 'https://example.com/same-source',
    })

    expect(challengeSource.url.value).toBe('https://example.com/same-source')
    expect(challengeSource.challenge?.id.value).toBe(challenge.id.value)
    expect(challengeSourcesRepository.replace).toHaveBeenCalledWith(challengeSource)
    expect(response).toEqual(challengeSource.dto)
  })

  it('should update source url and remove challenge link when challengeId is not provided', async () => {
    const challengeSource = ChallengeSourcesFaker.fake()

    challengeSourcesRepository.findById.mockResolvedValue(challengeSource)

    const response = await useCase.execute({
      challengeSourceId: challengeSource.id.value,
      url: 'https://example.com/updated-source',
    })

    expect(challengeSource.url.value).toBe('https://example.com/updated-source')
    expect(challengeSource.challenge).toBeNull()
    expect(challengesRepository.findById).not.toHaveBeenCalled()
    expect(challengeSourcesRepository.findByChallengeId).not.toHaveBeenCalled()
    expect(challengeSourcesRepository.replace).toHaveBeenCalledWith(challengeSource)
    expect(response).toEqual(challengeSource.dto)
  })

  it('should update additional instructions when a non-empty string is provided', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeSource = ChallengeSourcesFaker.fake({
      challenge: {
        id: challenge.id.value,
        title: challenge.title.value,
        slug: challenge.slug.value,
      },
      additionalInstructions: null,
    })
    const additionalInstructions = 'Prioritize edge cases and mention common mistakes.'

    challengeSourcesRepository.findById.mockResolvedValue(challengeSource)
    challengesRepository.findById.mockResolvedValue(challenge)
    challengeSourcesRepository.findByChallengeId.mockResolvedValue(challengeSource)

    const response = await useCase.execute({
      challengeSourceId: challengeSource.id.value,
      challengeId: challenge.id.value,
      url: 'https://example.com/source-with-instructions',
      additionalInstructions,
    })

    expect(challengeSource.additionalInstructions?.value).toBe(additionalInstructions)
    expect(challengeSource.challenge?.id.value).toBe(challenge.id.value)
    expect(challengeSourcesRepository.replace).toHaveBeenCalledWith(challengeSource)
    expect(response.additionalInstructions).toBe(additionalInstructions)
    expect(response.challenge?.id).toBe(challenge.id.value)
  })

  it('should clear additional instructions when null is provided', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeSource = ChallengeSourcesFaker.fake({
      challenge: {
        id: challenge.id.value,
        title: challenge.title.value,
        slug: challenge.slug.value,
      },
    })

    challengeSourcesRepository.findById.mockResolvedValue(challengeSource)
    challengesRepository.findById.mockResolvedValue(challenge)
    challengeSourcesRepository.findByChallengeId.mockResolvedValue(challengeSource)

    const response = await useCase.execute({
      challengeSourceId: challengeSource.id.value,
      challengeId: challenge.id.value,
      url: 'https://example.com/source-cleared-with-null',
      additionalInstructions: null,
    })

    expect(challengeSource.additionalInstructions).toBeNull()
    expect(challengeSource.challenge?.id.value).toBe(challenge.id.value)
    expect(challengeSourcesRepository.replace).toHaveBeenCalledWith(challengeSource)
    expect(response.additionalInstructions).toBeNull()
    expect(response.challenge?.id).toBe(challenge.id.value)
  })

  it('should clear additional instructions when an empty string is provided', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeSource = ChallengeSourcesFaker.fake({
      challenge: {
        id: challenge.id.value,
        title: challenge.title.value,
        slug: challenge.slug.value,
      },
    })

    challengeSourcesRepository.findById.mockResolvedValue(challengeSource)
    challengesRepository.findById.mockResolvedValue(challenge)
    challengeSourcesRepository.findByChallengeId.mockResolvedValue(challengeSource)

    const response = await useCase.execute({
      challengeSourceId: challengeSource.id.value,
      challengeId: challenge.id.value,
      url: 'https://example.com/source-cleared-with-empty-string',
      additionalInstructions: '',
    })

    expect(challengeSource.additionalInstructions).toBeNull()
    expect(challengeSource.challenge?.id.value).toBe(challenge.id.value)
    expect(challengeSourcesRepository.replace).toHaveBeenCalledWith(challengeSource)
    expect(response.additionalInstructions).toBeNull()
    expect(response.challenge?.id).toBe(challenge.id.value)
  })

  it('should update source url and challenge link when challengeId is provided', async () => {
    const challenge = ChallengesFaker.fake()
    const challengeSource = ChallengeSourcesFaker.fake({
      challenge: null,
    })

    challengeSourcesRepository.findById.mockResolvedValue(challengeSource)
    challengesRepository.findById.mockResolvedValue(challenge)
    challengeSourcesRepository.findByChallengeId.mockResolvedValue(null)

    const response = await useCase.execute({
      challengeSourceId: challengeSource.id.value,
      challengeId: challenge.id.value,
      url: 'https://example.com/updated-source-with-challenge',
    })

    expect(challengeSource.url.value).toBe(
      'https://example.com/updated-source-with-challenge',
    )
    expect(challengeSource.challenge?.id.value).toBe(challenge.id.value)
    expect(challengeSource.challenge?.title.value).toBe(challenge.title.value)
    expect(challengeSource.challenge?.slug.value).toBe(challenge.slug.value)
    expect(challengeSourcesRepository.replace).toHaveBeenCalledWith(challengeSource)
    expect(response).toEqual(challengeSource.dto)
  })
})
