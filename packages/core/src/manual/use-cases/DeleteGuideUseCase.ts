import { Id } from '#global/domain/structures/Id'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import { GuideNotFoundError } from '../domain/errors'
import { GuideDeletedEvent } from '../domain/events'
import type { GuidesRepository } from '../interfaces'

type Request = {
  guideId: string
}

type Response = Promise<void>

export class DeleteGuideUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: GuidesRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ guideId }: Request): Response {
    const guide = await this.findGuide(Id.create(guideId))
    await this.repository.remove(guide)
    const event = new GuideDeletedEvent({ guideId: guide.id.value })
    await this.broker.publish(event)
  }

  private async findGuide(guideId: Id) {
    const guide = await this.repository.findById(guideId)
    if (!guide) throw new GuideNotFoundError()
    return guide
  }
}
