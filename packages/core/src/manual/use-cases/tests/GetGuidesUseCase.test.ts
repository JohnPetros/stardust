import { mock, type Mock } from 'ts-jest-mocker'

import { GuidesFaker } from '#manual/domain/entities/fakers/GuidesFaker'
import { GuideCategory } from '#manual/domain/structures/GuideCategory'
import type { GuidesRepository } from '#manual/interfaces/GuidesRepository'
import { GetGuidesUseCase } from '../GetGuidesUseCase'

describe('Get Guides Use Case', () => {
  let repository: Mock<GuidesRepository>
  let useCase: GetGuidesUseCase

  beforeEach(() => {
    repository = mock<GuidesRepository>()
    repository.findAllByCategory.mockImplementation()
    useCase = new GetGuidesUseCase(repository)
  })

  it('should return all guides from the requested category', async () => {
    const firstGuide = GuidesFaker.fake()
    const secondGuide = GuidesFaker.fake()
    const category = GuideCategory.createAsMdx()

    repository.findAllByCategory.mockResolvedValue([firstGuide, secondGuide])

    const result = await useCase.execute({
      category: category.value,
    })

    expect(repository.findAllByCategory).toHaveBeenCalledTimes(1)
    expect(repository.findAllByCategory).toHaveBeenCalledWith(category)
    expect(result).toEqual([firstGuide.dto, secondGuide.dto])
  })
})
