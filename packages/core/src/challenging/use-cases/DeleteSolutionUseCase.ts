import { Id } from '#global/domain/structures/Id'
import { SolutionNotFoundError } from '#challenging/domain/errors/SolutionNotFoundError'
import type { UseCase } from '../../global/interfaces'
import type { SolutionsRepository } from '../interfaces'

type Request = {
  solutionId: string
}

export class DeleteSolutionUseCase implements UseCase<Request> {
  constructor(private readonly repository: SolutionsRepository) {}

  async execute({ solutionId }: Request) {
    const solution = await this.repository.findById(Id.create(solutionId))
    if (!solution) throw new SolutionNotFoundError()

    await this.repository.remove(solution.id)
  }
}
