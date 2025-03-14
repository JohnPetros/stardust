import type { UserDto } from '#global/dtos'
import { User } from '#global/entities'
import { Solution } from '#challenging/entities'
import type { IChallengingService, IUseCase } from '#interfaces'

type Request = {
  userDto: UserDto
  solutionId: string
}

type Response = Promise<{
  upvotesCount: number
  userUpvotedSolutionsIds: string[]
}>

export class UpvoteSolutionUseCase implements IUseCase<Request, Response> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ userDto, solutionId }: Request) {
    const user = User.create(userDto)
    const solution = await this.fetchSolution(solutionId)
    const isSolutionUpvoted = user.hasUpvotedSolution(solution.id)

    if (isSolutionUpvoted.isTrue) {
      user.removeUpvoteSolution(solution)
      const response = await this.challengingService.deleteSolutionUpvote(
        solution.id,
        user.id,
      )
      if (response.isFailure) response.throwError()
    }

    if (isSolutionUpvoted.isFalse) {
      user.upvoteSolution(solution)
      const response = await this.challengingService.saveSolutionUpvote(
        solution.id,
        user.id,
      )
      if (response.isFailure) response.throwError()
    }

    return {
      upvotesCount: solution.upvotesCount.value,
      userUpvotedSolutionsIds: user.upvotedSolutionsIds.items,
    }
  }

  private async fetchSolution(solutionId: string) {
    const response = await this.challengingService.fetchSolutionById(solutionId)
    if (response.isFailure) response.throwError()
    return Solution.create(response.body)
  }
}
