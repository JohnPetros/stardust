import type { UseCase } from '../../global/interfaces'
import type { ChallengingService } from '../interfaces'
import { Solution } from '../domain/entities'
import { Id } from '#global/domain/structures/Id'

type Request = {
  solutionId: string
  solutionTitle: string
  solutionContent: string
}

export class EditSolutionUseCase implements UseCase<Request> {
  constructor(private readonly challengingService: ChallengingService) {}

  async execute({ solutionId, solutionTitle, solutionContent }: Request) {
    const solution = await this.fetchSolution(Id.create(solutionId))
    solution.title = solutionTitle
    solution.content = solutionContent

    await this.updateSolution(solution)
    return solution.dto
  }

  private async fetchSolution(solutionId: Id) {
    const response = await this.challengingService.fetchSolutionById(solutionId)
    if (response.isFailure) response.throwError()
    return Solution.create(response.body)
  }

  private async updateSolution(solution: Solution) {
    const response = await this.challengingService.updateSolution(solution)
    if (response.isFailure) response.throwError()
  }
}
