import type { GuideDto } from '../domain/entities/dtos'
import type { UseCase } from '#global/interfaces/UseCase'
import type { GuidesRepository } from '../interfaces'
import { Id } from '#global/domain/structures/Id'
import { GuideNotFoundError } from '../domain/errors'
import { Text } from '#global/domain/structures/Text'

type Request = {
  guideId: string
  guideContent: string
}

type Response = Promise<GuideDto>

export class EditGuideContentUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: GuidesRepository) {}

  async execute({ guideId, guideContent }: Request): Response {
    const guide = await this.findGuideById(Id.create(guideId))
    guide.content = Text.create(guideContent)
    await this.repository.replace(guide)
    return guide.dto
  }

  private async findGuideById(guideId: Id) {
    const guide = await this.repository.findById(guideId)
    if (!guide) throw new GuideNotFoundError()
    return guide
  }
}
