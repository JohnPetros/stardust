import { Solution } from '../domain/entities'
import type { SolutionDto } from '../domain/entities/dtos'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengingService } from '../interfaces'

type Request = {
  solutionSlug: string
}

type Response = Promise<SolutionDto>

export class ViewSolutionUseCase implements UseCase<Request, Response> {
  constructor(private readonly challengingService: ChallengingService) {}

  async execute({ solutionSlug }: Request) {
    const solution = await this.fetchSolution(solutionSlug)
    solution.view()

    const response = await this.challengingService.updateSolution(solution)
    if (response.isFailure) response.throwError()

    return solution.dto
  }

  private async fetchSolution(solutionSlug: string) {
    const response = await this.challengingService.fetchSolutionBySlug(solutionSlug)
    if (response.isFailure) response.throwError()
    return Solution.create(response.body)
  }
}
