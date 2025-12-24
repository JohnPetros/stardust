import type { GuideDto } from '../domain/entities/dtos'
import type { UseCase } from '#global/interfaces/UseCase'
import type { GuidesRepository } from '../interfaces'
import { Id } from '#global/domain/structures/Id'
import { Guide } from '../domain/entities'
import { GuideNotFoundError } from '../domain/errors'

type Request = {
  guideDto: GuideDto
}

type Response = Promise<GuideDto>

export class UpdateGuideUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: GuidesRepository) {}

  async execute({ guideDto }: Request): Response {
    const currentGuide = await this.findGuideById(Id.create(guideDto.id))
    const guide = Guide.create(guideDto)
    guide.position = currentGuide.position
    await this.repository.replace(guide)
    return guide.dto
  }

  private async findGuideById(guideId: Id) {
    const guide = await this.repository.findById(guideId)
    if (!guide) throw new GuideNotFoundError()
    return guide
  }
}
