import { mock, type Mock } from 'ts-jest-mocker'

import { GuidesFaker } from '#manual/domain/entities/fakers/GuidesFaker'
import { GetGuideUseCase } from '../GetGuideUseCase'
import { GuideNotFoundError } from '#manual/domain/errors/GuideNotFoundError'
import type { GuidesRepository } from '#manual/interfaces/GuidesRepository'

describe('Get Guide Use Case', () => {
  let repository: Mock<GuidesRepository>
  let useCase: GetGuideUseCase

  beforeEach(() => {
    repository = mock<GuidesRepository>()
    repository.findById.mockImplementation()
    useCase = new GetGuideUseCase(repository)
  })

  it('should throw an error if the guide does not exist', async () => {
    const guide = GuidesFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        guideId: guide.id.value,
      }),
    ).rejects.toThrow(GuideNotFoundError)
  })

  it('should return the guide if it exists', async () => {
    const existingGuide = GuidesFaker.fake()
    repository.findById.mockResolvedValue(existingGuide)

    const result = await useCase.execute({
      guideId: existingGuide.id.value,
    })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findById).toHaveBeenCalledWith(existingGuide.id)
    expect(result).toEqual(existingGuide.dto)
  })
})
