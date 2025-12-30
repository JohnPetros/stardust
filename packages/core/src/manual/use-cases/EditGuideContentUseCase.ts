import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/index'
import type { GuideDto } from '../domain/entities/dtos'
import type { GuidesRepository } from '../interfaces'
import { Id } from '#global/domain/structures/Id'
import { Text } from '#global/domain/structures/Text'
import { GuideNotFoundError } from '../domain/errors'
import { GuideContentEditedEvent } from '../domain/events'

type Request = {
  guideId: string
  guideContent: string
}

type Response = Promise<GuideDto>

export class EditGuideContentUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: GuidesRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ guideId, guideContent }: Request): Response {
    const guide = await this.findGuideById(Id.create(guideId))
    guide.content = Text.create(guideContent)
    await this.repository.replace(guide)
    const event = new GuideContentEditedEvent({ guideId, guideContent })
    await this.broker.publish(event)
    return guide.dto
  }

  private async findGuideById(guideId: Id) {
    const guide = await this.repository.findById(guideId)
    if (!guide) throw new GuideNotFoundError()
    return guide
  }
}
