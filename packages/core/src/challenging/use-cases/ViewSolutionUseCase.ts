import type { UserDto } from '../../global/dtos'
import { Solution } from '../domain/entities'
import type { IChallengingService, IUseCase } from '../../global/interfaces'
import type { SolutionDto } from '../dtos'

type Request = {
  solutionSlug: string
}

type Response = Promise<SolutionDto>

export class ViewSolutionUseCase implements IUseCase<Request, Response> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ solutionSlug }: Request) {
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
