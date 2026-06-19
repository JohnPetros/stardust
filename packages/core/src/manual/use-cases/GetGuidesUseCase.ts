import type { GuideDto } from '../domain/entities/dtos'
import { GuideCategory } from '../domain/structures'
import type { GuidesRepository } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'

type Request = {
  category: string
}

type Response = Promise<GuideDto[]>

export class GetGuidesUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: GuidesRepository) {}

  async execute({ category }: Request): Response {
    const guides = await this.repository.findAllByCategory(GuideCategory.create(category))
    return guides.map((guide) => guide.dto)
  }
}
