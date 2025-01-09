import type { IChallengingService, IUseCase } from '#interfaces'
import { Challenge, Solution } from '#challenging/entities'
import type { SolutionDto } from '#challenging/dtos'
import { Slug } from '#global/structs'
import { AppError, ValidationError } from '#global/errors'

type Request = {
  solutionTitle: string
  solutionContent: string
  authorId: string
  challengeId: string
}

type Response = Promise<SolutionDto>

export class PostSolutionUseCase implements IUseCase<Request, Response> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ solutionTitle, solutionContent, authorId, challengeId }: Request) {
    await this.fetchSolution(solutionTitle)
    const solution = Solution.create({
      title: solutionTitle,
      content: solutionContent,
      author: { id: authorId },
    })
    await this.fetchChallenge(challengeId)

    await this.saveSolution(solution, challengeId)
    return solution.dto
  }

  private async fetchChallenge(challengeId: string) {
    const response = await this.challengingService.fetchChallengeById(challengeId)
    if (response.isFailure) response.throwError()
    return Challenge.create(response.body)
  }

  private async fetchSolution(solutionTitle: string) {
    const response = await this.challengingService.fetchSolutionBySlug(
      Slug.create(solutionTitle).value,
    )
    if (response.isSuccess)
      throw new ValidationError([
        { name: 'solutionTitle', messages: ['Título já usado por outra solução'] },
      ])
  }

  private async saveSolution(solution: Solution, challengeId: string) {
    const response = await this.challengingService.saveSolution(solution, challengeId)
    if (response.isFailure) response.throwError()
  }
}
