import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { ChallengeNotFoundError } from '#challenging/domain/errors/ChallengeNotFoundError'
import { ChallengeAlreadyExistsError } from '#challenging/domain/errors/ChallengeAlreadyExistsError'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import type { ChallengeRoadmapsRepository } from '#challenging/interfaces/ChallengeRoadmapsRepository'
import { Logical } from '#global/domain/structures/Logical'
import type { ChallengeDto } from '../../domain/entities/dtos'
import { UpdateChallengeUseCase } from '../UpdateChallengeUseCase'

describe('Update Challenge Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let roadmapsRepository: Mock<ChallengeRoadmapsRepository>
  let useCase: UpdateChallengeUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.findById.mockImplementation()
    repository.findBySlug.mockImplementation()
    repository.replace.mockImplementation()
    roadmapsRepository = mock<ChallengeRoadmapsRepository>()
    roadmapsRepository.hasChallengeInPublishedRevision.mockResolvedValue(
      Logical.create(false),
    )
    useCase = new UpdateChallengeUseCase(repository, roadmapsRepository)
  })

  it('should reject privatizing a challenge from the published roadmap', async () => {
    const challenge = ChallengesFaker.fake({ isPublic: true })
    const privateDto = { ...challenge.dto, isPublic: false }
    repository.findById.mockResolvedValue(challenge)
    roadmapsRepository.hasChallengeInPublishedRevision.mockResolvedValue(
      Logical.create(true),
    )

    await expect(useCase.execute({ challengeDto: privateDto })).rejects.toThrow(
      'roadmap publicado',
    )
    expect(repository.replace).not.toHaveBeenCalled()
  })

  it('does not consult roadmap membership for a public update', async () => {
    const challenge = ChallengesFaker.fake({ isPublic: true })
    repository.findById.mockResolvedValue(challenge)

    await useCase.execute({ challengeDto: { ...challenge.dto, isPublic: true } })

    expect(roadmapsRepository.hasChallengeInPublishedRevision).not.toHaveBeenCalled()
  })

  it('should throw an error if the challenge does not exist', async () => {
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

  it('should replace editable fields when title does not change', async () => {
    const currentChallenge = ChallengesFaker.fake()
    const updatedDto = ChallengesFaker.fakeDto({
      id: currentChallenge.id.value,
      title: currentChallenge.title.value,
      description: 'updated description',
      initialCode: 'print("updated")',
      isPublic: !currentChallenge.isPublic.value,
      categories: ChallengesFaker.fakeDto().categories,
      testCases: ChallengesFaker.fakeDto().testCases,
      author: currentChallenge.author.dto,
      difficultyLevel: currentChallenge.difficulty.level,
      postedAt: currentChallenge.postedAt,
    })
    const updatedChallenge = ChallengesFaker.fake(updatedDto)

    repository.findById
      .mockResolvedValueOnce(currentChallenge)
      .mockResolvedValueOnce(updatedChallenge)

    const response = await useCase.execute({
      challengeDto: updatedDto,
    })

    expect(repository.findBySlug).not.toHaveBeenCalled()
    expect(repository.replace).toHaveBeenCalledWith(updatedChallenge)
    expect(response).toEqual(updatedChallenge.dto)
  })

  it('should return the persisted challenge payload after update', async () => {
    const currentChallenge = ChallengesFaker.fake({
      upvotesCount: 9,
      downvotesCount: 3,
      completionCount: 12,
      isNew: true,
    })
    const updateRequest: ChallengeDto = {
      id: currentChallenge.id.value,
      title: currentChallenge.title.value,
      description: 'updated challenge description',
      initialCode: 'console.log("updated")',
      difficultyLevel: currentChallenge.difficulty.level,
      author: currentChallenge.author.dto,
      testCases: ChallengesFaker.fakeDto().testCases,
      categories: ChallengesFaker.fakeDto().categories,
      isPublic: currentChallenge.isPublic.value,
      postedAt: currentChallenge.postedAt,
    }
    const updatedChallenge = ChallengesFaker.fake(updateRequest)
    const persistedChallenge = ChallengesFaker.fake({
      ...currentChallenge.dto,
      ...updateRequest,
      upvotesCount: currentChallenge.upvotesCount.value,
      downvotesCount: currentChallenge.downvotesCount.value,
      completionCount: currentChallenge.completionCount.value,
      isNew: currentChallenge.isNew.value,
      postedAt: currentChallenge.postedAt,
    })

    repository.findById
      .mockResolvedValueOnce(currentChallenge)
      .mockResolvedValueOnce(persistedChallenge)

    const response = await useCase.execute({
      challengeDto: updateRequest,
    })

    expect(response).toEqual(persistedChallenge.dto)
    expect(repository.replace).toHaveBeenCalledWith(updatedChallenge)
  })
})
