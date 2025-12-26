import type { GuideDto } from '../domain/entities/dtos'
import type { GuidesRepository } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'
import { Guide } from '../domain/entities'
import { GuideCategory } from '../domain/structures'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

type Request = {
  guideDto: GuideDto
}

type Response = Promise<GuideDto>

export class CreateGuideUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: GuidesRepository) {}

  async execute({ guideDto }: Request): Response {
    const position = await this.findLastGuidePosition()
    const guide = Guide.create({ ...guideDto, position: position.value })
    await this.repository.add(guide)
    return guide.dto
  }

  private async findLastGuidePosition() {
    const guide = await this.repository.findLastByPositionAndCategory(
      GuideCategory.createAsLsp(),
    )
    if (!guide) return OrdinalNumber.create(1)
    return guide.position.increment()
  }
}
