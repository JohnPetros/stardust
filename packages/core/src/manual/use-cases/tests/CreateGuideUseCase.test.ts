import { mock, type Mock } from 'ts-jest-mocker'
import { GuideCategory } from '#manual/domain/structures/GuideCategory'

import { GuidesFaker } from '#manual/domain/entities/fakers/GuidesFaker'
import { CreateGuideUseCase } from '../CreateGuideUseCase'
import type { GuidesRepository } from '#manual/interfaces/GuidesRepository'

describe('Create Guide Use Case', () => {
  let repository: Mock<GuidesRepository>
  let useCase: CreateGuideUseCase

  beforeEach(() => {
    repository = mock<GuidesRepository>()
    repository.add.mockImplementation()
    repository.findLastByPositionAndCategory.mockImplementation()
    useCase = new CreateGuideUseCase(repository)
  })

  it('should create the first guide with position 1', async () => {
    const guideDto = GuidesFaker.fakeDto()
    repository.findLastByPositionAndCategory.mockResolvedValue(null)

    const result = await useCase.execute({
      guideDto,
    })

    expect(repository.findLastByPositionAndCategory).toHaveBeenCalledWith(
      GuideCategory.createAsLsp(),
    )
    expect(repository.add).toHaveBeenCalledTimes(1)
    const createdGuide = repository.add.mock.calls[0][0]
    expect(createdGuide.position.value).toBe(1)
    expect(createdGuide.title.value).toBe(guideDto.title)
    expect(result).toEqual(createdGuide.dto)
  })

  it('should create a guide with incremented position', async () => {
    const lastGuide = GuidesFaker.fake({ position: 5 })
    const guideDto = GuidesFaker.fakeDto()
    repository.findLastByPositionAndCategory.mockResolvedValue(lastGuide)

    const result = await useCase.execute({
      guideDto,
    })

    expect(repository.findLastByPositionAndCategory).toHaveBeenCalledTimes(1)
    expect(repository.add).toHaveBeenCalledTimes(1)
    const createdGuide = repository.add.mock.calls[0][0]
    expect(createdGuide.position.value).toBe(6)
    expect(result).toEqual(createdGuide.dto)
  })
})
