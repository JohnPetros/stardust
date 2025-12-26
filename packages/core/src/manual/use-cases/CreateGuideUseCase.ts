import type { GuideDto } from '../domain/entities/dtos'
import type { GuidesRepository } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'
import { Guide } from '../domain/entities'
import { GuideCategory } from '../domain/structures'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

type Request = {
  guideTitle: string
  guideCategory: string
}

type Response = Promise<GuideDto>

export class CreateGuideUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: GuidesRepository) {}

  async execute({ guideTitle, guideCategory }: Request): Response {
    const category = GuideCategory.create(guideCategory)
    const position = await this.findLastGuidePosition(category)
    const guide = Guide.create({ 
      title: guideTitle,
      content: '',
      position: position.value,
      category: category.value,
    })
    await this.repository.add(guide)
    return guide.dto
  }

  private async findLastGuidePosition(category: GuideCategory) {
    const guide = await this.repository.findLastByPositionAndCategory(category)
    if (!guide) return OrdinalNumber.create(1)
    return guide.position.increment()
  }
}
