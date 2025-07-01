import { Id } from '#global/domain/structures/Id'
import { SolutionNotFoundError } from '#challenging/domain/errors/SolutionNotFoundError'
import { SolutionTitleAlreadyInUseError } from '#challenging/domain/errors/SolutionTitleAlreadyInUseError'
import { Slug } from '#global/domain/structures/Slug'
import type { UseCase } from '../../global/interfaces'
import type { SolutionsRepository } from '../interfaces'
import type { SolutionDto } from '../domain/entities/dtos'

type Request = {
  solutionId: string
  solutionTitle: string
  solutionContent: string
}

type Response = Promise<SolutionDto>

export class EditSolutionUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SolutionsRepository) {}

  async execute({ solutionId, solutionTitle, solutionContent }: Request) {
    const solution = await this.repository.findById(Id.create(solutionId))
    if (!solution) throw new SolutionNotFoundError()

    if (solution.title.value !== solutionTitle) {
      await this.checkIfSolutionTitleIsInUse(solutionTitle)
    }

    solution.title = solutionTitle
    solution.content = solutionContent

    await this.repository.replace(solution)
    return solution.dto
  }

  private async checkIfSolutionTitleIsInUse(solutionTitle: string) {
    const solution = await this.repository.findBySlug(Slug.create(solutionTitle))
    if (solution) throw new SolutionTitleAlreadyInUseError()
  }
}
