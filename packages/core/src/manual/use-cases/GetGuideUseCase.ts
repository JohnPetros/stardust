import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { GuideNotFoundError } from '../domain/errors'

type Request = {
  guideId: string
}

type Response = Promise<GuideDto>

export class GetGuideUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: GuidesRepository) {}

  async execute({ guideId }: Request) {
    const guide = await this.repository.findById(Id.create(guideId))
    if (!guide) {
      throw new GuideNotFoundError()
    }
    return guide
  }
}
