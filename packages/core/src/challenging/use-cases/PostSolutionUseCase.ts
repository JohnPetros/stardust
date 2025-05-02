import type { UseCase } from '#global/interfaces/index'
import { Slug } from '#global/domain/structures/index'
import { ValidationError } from '#global/domain/errors/index'
import { Challenge, Solution } from '../domain/entities'
import type { ChallengingService } from '../interfaces'
import type { SolutionDto } from '../domain/entities/dtos'

type Request = {
  solutionTitle: string
  solutionContent: string
  authorId: string
  challengeId: string
}

type Response = Promise<SolutionDto>

export class PostSolutionUseCase implements UseCase<Request, Response> {
  constructor(private readonly challengingService: ChallengingService) {}

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
