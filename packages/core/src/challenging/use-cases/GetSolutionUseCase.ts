import type { UseCase } from '#global/interfaces/UseCase'
import { Slug } from '#global/domain/structures/index'
import { SolutionNotFoundError } from '#challenging/domain/errors/SolutionNotFoundError'
import type { SolutionDto } from '../domain/entities/dtos'
import type { SolutionsRepository } from '../interfaces'

type Request = {
  solutionSlug: string
}

type Response = Promise<SolutionDto>

export class GetSolutionUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SolutionsRepository) {}

  async execute(request: Request) {
    const solution = await this.repository.findBySlug(Slug.create(request.solutionSlug))
    if (!solution) {
      throw new SolutionNotFoundError()
    }
    return solution.dto
  }
}
