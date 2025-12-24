import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { UseCase } from '#global/interfaces/UseCase'
import type { GuidesRepository } from '../interfaces/GuidesRepository'
import type { Guide } from '../domain/entities/Guide'
import type { GuideDto } from '../domain/entities/dtos/GuideDto'
import { GuideNotFoundError } from '../domain/errors'
import { ConflictError } from '#global/domain/errors/ConflictError'

type Request = {
  guideIds: string[]
}

type Response = Promise<GuideDto[]>

export class ReorderGuidesUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: GuidesRepository) {}

  async execute({ guideIds }: Request): Response {
    const guides = await this.repository.findAll()
    const reorderedGuides: Guide[] = []

    if (new Set(guideIds).size !== guideIds.length) {
      throw new ConflictError('Todos os IDs das guias devem ser fornecidos e únicos')
    }

    for (let number = 1; number <= guideIds.length; number++) {
      const guideId = guideIds[number - 1]
      const guide = guides.find((guide) => guide.id.value === guideId)
      if (!guide) throw new GuideNotFoundError()

      guide.position = OrdinalNumber.create(number)
      reorderedGuides.push(guide)
    }

    await this.repository.replaceMany(reorderedGuides)
    return reorderedGuides.map((guide) => guide.dto)
  }
}
