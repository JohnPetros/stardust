import { mock, type Mock } from 'ts-jest-mocker'

import { GuidesFaker } from '#manual/domain/entities/fakers/GuidesFaker'
import type { GuidesRepository } from '#manual/interfaces/GuidesRepository'
import { CreateGuideUseCase } from '../CreateGuideUseCase'

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
    repository.findLastByPositionAndCategory.mockResolvedValue(null)

    const result = await useCase.execute({
      guideTitle: 'Minha Guia',
      guideCategory: 'lsp',
    })

    expect(repository.findLastByPositionAndCategory).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'lsp' }),
    )
    expect(repository.add).toHaveBeenCalledTimes(1)
    const createdGuide = repository.add.mock.calls[0][0]
    expect(createdGuide.position.value).toBe(1)
    expect(createdGuide.title.value).toBe('Minha Guia')
    expect(createdGuide.category.value).toBe('lsp')
    expect(result).toEqual(createdGuide.dto)
  })

  it('should create a guide with incremented position', async () => {
    const lastGuide = GuidesFaker.fake({ position: 5 })
    repository.findLastByPositionAndCategory.mockResolvedValue(lastGuide)

    const result = await useCase.execute({
      guideTitle: 'Outra Guia',
      guideCategory: 'mdx',
    })

    expect(repository.findLastByPositionAndCategory).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'mdx' }),
    )
    expect(repository.add).toHaveBeenCalledTimes(1)
    const createdGuide = repository.add.mock.calls[0][0]
    expect(createdGuide.position.value).toBe(6)
    expect(createdGuide.title.value).toBe('Outra Guia')
    expect(createdGuide.category.value).toBe('mdx')
    expect(result).toEqual(createdGuide.dto)
  })
})
