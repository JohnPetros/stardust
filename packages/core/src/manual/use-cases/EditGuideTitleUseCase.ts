import type { GuideDto } from '../domain/entities/dtos'
import type { UseCase } from '#global/interfaces/UseCase'
import type { GuidesRepository } from '../interfaces'
import type { Guide } from '../domain/entities'
import { Id } from '#global/domain/structures/Id'
import { Name } from '#global/domain/structures/Name'
import { GuideNotFoundError } from '../domain/errors'

type Request = {
  guideId: string
  guideTitle: string
}

type Response = Promise<GuideDto>

export class EditGuideTitleUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: GuidesRepository) {}

  async execute({ guideId, guideTitle }: Request): Response {
    const guide = await this.findGuideById(Id.create(guideId))
    guide.title = Name.create(guideTitle)
    await this.repository.replace(guide)
    return guide.dto
  }

  private async findGuideById(guideId: Id): Promise<Guide> {
    const guide = await this.repository.findById(guideId)
    if (!guide) throw new GuideNotFoundError()
    return guide
  }
}
