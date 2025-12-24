import { mock, type Mock } from 'ts-jest-mocker'

import { GuidesFaker } from '#manual/domain/entities/fakers/GuidesFaker'
import { UpdateGuideUseCase } from '../UpdateGuideUseCase'
import { GuideNotFoundError } from '#manual/domain/errors/GuideNotFoundError'
import type { GuidesRepository } from '#manual/interfaces/GuidesRepository'

describe('Update Guide Use Case', () => {
  let repository: Mock<GuidesRepository>
  let useCase: UpdateGuideUseCase

  beforeEach(() => {
    repository = mock<GuidesRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new UpdateGuideUseCase(repository)
  })

  it('should throw an error if the guide does not exist', async () => {
    const guide = GuidesFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        guideDto: guide.dto,
      }),
    ).rejects.toThrow(GuideNotFoundError)
  })

  it('should update a guide and preserve its position', async () => {
    const existingGuide = GuidesFaker.fake({ position: 1 })
    const updatedGuideDto = GuidesFaker.fakeDto({
      id: existingGuide.id.value,
      position: 999,
    })
    repository.findById.mockResolvedValue(existingGuide)

    const result = await useCase.execute({
      guideDto: updatedGuideDto,
    })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findById).toHaveBeenCalledWith(existingGuide.id)
    expect(repository.replace).toHaveBeenCalledTimes(1)

    const replacedGuide = repository.replace.mock.calls[0][0]
    expect(replacedGuide.id.value).toBe(existingGuide.id.value)
    expect(replacedGuide.position.value).toBe(existingGuide.position.value)
    expect(replacedGuide.position.value).not.toBe(updatedGuideDto.position)

    expect(result.position).toBe(existingGuide.position.value)
  })
})
