import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import { GuideNotFoundError } from '../domain/errors'
import type { GuidesRepository } from '../interfaces'

type Request = {
  guideId: string
}

type Response = Promise<void>

export class DeleteGuideUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: GuidesRepository) {}

  async execute({ guideId }: Request): Response {
    const guide = await this.findGuide(Id.create(guideId))
    await this.repository.remove(guide)
  }

  private async findGuide(guideId: Id) {
    const guide = await this.repository.findById(guideId)
    if (!guide) throw new GuideNotFoundError()
    return guide
  }
}
