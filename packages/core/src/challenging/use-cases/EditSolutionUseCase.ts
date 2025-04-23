import type { IChallengingService, UseCase } from '../../global/interfaces'
import { Solution } from '../domain/entities'

type Request = {
  solutionId: string
  solutionTitle: string
  solutionContent: string
}

export class EditSolutionUseCase implements UseCase<Request> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ solutionId, solutionTitle, solutionContent }: Request) {
    const solution = await this.fetchSolution(solutionId)
    solution.title = solutionTitle
    solution.content = solutionContent

    await this.updateSolution(solution)
    return solution.dto
  }

  private async fetchSolution(SolutionId: string) {
    const response = await this.challengingService.fetchSolutionById(SolutionId)
    if (response.isFailure) response.throwError()
    return Solution.create(response.body)
  }

  private async updateSolution(solution: Solution) {
    const response = await this.challengingService.updateSolution(solution)
    if (response.isFailure) response.throwError()
  }
}
