import { mock, type Mock } from 'ts-jest-mocker'

import type { GuidesRepository } from '#manual/interfaces/GuidesRepository'
import { GuideNotFoundError } from '#manual/domain/errors/GuideNotFoundError'
import { GuidesFaker } from '#manual/domain/entities/fakers/GuidesFaker'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'
import { DeleteGuideUseCase } from '../DeleteGuideUseCase'

describe('Delete Guide Use Case', () => {
  let repository: Mock<GuidesRepository>
  let useCase: DeleteGuideUseCase

  beforeEach(() => {
    repository = mock<GuidesRepository>()
    repository.findById.mockImplementation()
    repository.remove.mockImplementation()

    useCase = new DeleteGuideUseCase(repository)
  })

  it('should throw an error if the guide does not exist', async () => {
    const nonExistentId = IdFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        guideId: nonExistentId.value,
      }),
    ).rejects.toThrow(GuideNotFoundError)
  })

  it('should remove the guide from the repository', async () => {
    const guide = GuidesFaker.fake()
    repository.findById.mockResolvedValue(guide)

    await useCase.execute({
      guideId: guide.id.value,
    })

    expect(repository.remove).toHaveBeenCalledTimes(1)
    expect(repository.remove).toHaveBeenCalledWith(guide)
  })
})
