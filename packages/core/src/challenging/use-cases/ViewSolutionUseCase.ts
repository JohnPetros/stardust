import type { SolutionDto } from '../domain/entities/dtos'
import type { UseCase } from '#global/interfaces/UseCase'
import type { SolutionsRepository } from '../interfaces'
import { SolutionNotFoundError } from '#challenging/domain/errors/SolutionNotFoundError'
import { Slug } from '#global/domain/structures/Slug'

type Request = {
  solutionSlug: string
}

type Response = Promise<SolutionDto>

export class ViewSolutionUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SolutionsRepository) {}

  async execute({ solutionSlug }: Request) {
    const solution = await this.repository.findBySlug(Slug.create(solutionSlug))
    if (!solution) throw new SolutionNotFoundError()

    solution.view()

    await this.repository.replace(solution)
    return solution.dto
  }
}
