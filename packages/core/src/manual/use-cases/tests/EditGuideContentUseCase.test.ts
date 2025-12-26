import { mock, type Mock } from 'ts-jest-mocker'

import { GuidesFaker } from '#manual/domain/entities/fakers/GuidesFaker'
import { EditGuideContentUseCase } from '../EditGuideContentUseCase'
import { GuideNotFoundError } from '#manual/domain/errors/GuideNotFoundError'
import type { GuidesRepository } from '#manual/interfaces/GuidesRepository'

describe('Edit Guide Content Use Case', () => {
  let repository: Mock<GuidesRepository>
  let useCase: EditGuideContentUseCase

  beforeEach(() => {
    repository = mock<GuidesRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new EditGuideContentUseCase(repository)
  })

  it('should throw an error if the guide does not exist', async () => {
    const guide = GuidesFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        guideId: guide.id.value,
        guideContent: 'New Content',
      }),
    ).rejects.toThrow(GuideNotFoundError)
  })

  it('should update the guide content', async () => {
    const existingGuide = GuidesFaker.fake()
    const newContent = 'New Guide Content'
    repository.findById.mockResolvedValue(existingGuide)

    const result = await useCase.execute({
      guideId: existingGuide.id.value,
      guideContent: newContent,
    })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findById).toHaveBeenCalledWith(existingGuide.id)
    expect(repository.replace).toHaveBeenCalledTimes(1)

    const replacedGuide = repository.replace.mock.calls[0][0]
    expect(replacedGuide.id.value).toBe(existingGuide.id.value)
    expect(replacedGuide.content.value).toBe(newContent)

    expect(result.content).toBe(newContent)
  })
})
