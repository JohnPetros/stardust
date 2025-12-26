import { mock, type Mock } from 'ts-jest-mocker'

import { GuidesFaker } from '#manual/domain/entities/fakers/GuidesFaker'
import { EditGuideTitleUseCase } from '../EditGuideTitleUseCase'
import { GuideNotFoundError } from '#manual/domain/errors/GuideNotFoundError'
import type { GuidesRepository } from '#manual/interfaces/GuidesRepository'

describe('Edit Guide Title Use Case', () => {
  let repository: Mock<GuidesRepository>
  let useCase: EditGuideTitleUseCase

  beforeEach(() => {
    repository = mock<GuidesRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new EditGuideTitleUseCase(repository)
  })

  it('should throw an error if the guide does not exist', async () => {
    const guide = GuidesFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        guideId: guide.id.value,
        guideTitle: 'New Title',
      }),
    ).rejects.toThrow(GuideNotFoundError)
  })

  it('should update the guide title', async () => {
    const existingGuide = GuidesFaker.fake()
    const newTitle = 'New Guide Title'
    repository.findById.mockResolvedValue(existingGuide)

    const result = await useCase.execute({
      guideId: existingGuide.id.value,
      guideTitle: newTitle,
    })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findById).toHaveBeenCalledWith(existingGuide.id)
    expect(repository.replace).toHaveBeenCalledTimes(1)

    const replacedGuide = repository.replace.mock.calls[0][0]
    expect(replacedGuide.id.value).toBe(existingGuide.id.value)
    expect(replacedGuide.title.value).toBe(newTitle)

    expect(result.title).toBe(newTitle)
  })
})
