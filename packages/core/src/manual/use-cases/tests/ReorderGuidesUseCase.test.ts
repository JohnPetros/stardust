import { mock } from 'ts-jest-mocker'
import { faker } from '@faker-js/faker'

import { ReorderGuidesUseCase } from '../ReorderGuidesUseCase'
import { GuidesFaker } from '#manual/domain/entities/fakers/GuidesFaker'
import { GuideNotFoundError } from '#manual/domain/errors/GuideNotFoundError'
import type { GuidesRepository } from '#manual/interfaces/GuidesRepository'
import { ConflictError } from '#global/domain/errors/ConflictError'

describe('Reorder Guides Use Case', () => {
  let useCase: ReorderGuidesUseCase
  let repository: jest.Mocked<GuidesRepository>

  beforeEach(() => {
    repository = mock<GuidesRepository>()
    repository.replaceMany.mockImplementation()
    useCase = new ReorderGuidesUseCase(repository)
  })

  it('should reorder guides to match the provided id sequence', async () => {
    const guides = GuidesFaker.fakeMany(3)
    const shuffledIds = [guides[2].id.value, guides[0].id.value, guides[1].id.value]

    repository.findAll.mockResolvedValue(guides)
    repository.replaceMany.mockResolvedValue()

    const response = await useCase.execute({ guideIds: shuffledIds })

    expect(repository.findAll).toHaveBeenCalledTimes(1)
    expect(repository.replaceMany).toHaveBeenCalledTimes(1)

    const [reorderedGuides] = repository.replaceMany.mock.calls[0]
    expect(reorderedGuides).toHaveLength(3)
    expect(reorderedGuides[0].id.value).toBe(shuffledIds[0])
    expect(reorderedGuides[0].position.value).toBe(1)
    expect(reorderedGuides[1].id.value).toBe(shuffledIds[1])
    expect(reorderedGuides[1].position.value).toBe(2)
    expect(reorderedGuides[2].id.value).toBe(shuffledIds[2])
    expect(reorderedGuides[2].position.value).toBe(3)

    expect(response).toHaveLength(3)
    expect(response[0].id).toBe(shuffledIds[0])
    expect(response[1].id).toBe(shuffledIds[1])
    expect(response[2].id).toBe(shuffledIds[2])
  })

  it('should throw when any guide id is not found', async () => {
    const guides = GuidesFaker.fakeMany(2)
    const missingGuideId = faker.string.uuid()

    repository.findAll.mockResolvedValue(guides)

    await expect(
      useCase.execute({
        guideIds: [guides[0].id.value, missingGuideId],
      }),
    ).rejects.toThrow(GuideNotFoundError)
  })

  it('should throw ConflictError when duplicate guide ids are provided', async () => {
    const guides = GuidesFaker.fakeMany(2)
    const duplicateId = guides[0].id.value

    repository.findAll.mockResolvedValue(guides)

    await expect(
      useCase.execute({ guideIds: [duplicateId, duplicateId] }),
    ).rejects.toThrow(ConflictError)
  })

  it('should handle empty guide ids list', async () => {
    repository.findAll.mockResolvedValue([])
    repository.replaceMany.mockResolvedValue()

    const response = await useCase.execute({ guideIds: [] })

    expect(repository.findAll).toHaveBeenCalledTimes(1)
    expect(repository.replaceMany).toHaveBeenCalledTimes(1)
    expect(repository.replaceMany).toHaveBeenCalledWith([])
    expect(response).toHaveLength(0)
  })
})
