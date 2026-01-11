import { mock, type Mock } from 'ts-jest-mocker'

import type { GuidesRepository } from '#manual/interfaces/GuidesRepository'
import type { Broker } from '#global/interfaces/Broker'
import { GuideNotFoundError } from '#manual/domain/errors/GuideNotFoundError'
import { GuidesFaker } from '#manual/domain/entities/fakers/GuidesFaker'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'
import { GuideDeletedEvent } from '#manual/domain/events/GuideDeletedEvent'
import { DeleteGuideUseCase } from '../DeleteGuideUseCase'

describe('Delete Guide Use Case', () => {
  let repository: Mock<GuidesRepository>
  let broker: Mock<Broker>
  let useCase: DeleteGuideUseCase

  beforeEach(() => {
    repository = mock<GuidesRepository>()
    broker = mock<Broker>()
    repository.findById.mockImplementation()
    repository.remove.mockImplementation()
    broker.publish.mockImplementation()

    useCase = new DeleteGuideUseCase(repository, broker)
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

  it('should publish GuideDeletedEvent after deleting the guide', async () => {
    const guide = GuidesFaker.fake()
    repository.findById.mockResolvedValue(guide)

    await useCase.execute({
      guideId: guide.id.value,
    })

    expect(broker.publish).toHaveBeenCalledTimes(1)
    expect(broker.publish).toHaveBeenCalledWith(expect.any(GuideDeletedEvent))
    const event = broker.publish.mock.calls[0][0] as GuideDeletedEvent
    expect(event.payload.guideId).toBe(guide.id.value)
  })
})
