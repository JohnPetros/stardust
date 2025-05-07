import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '#profile/domain/entities/dtos/UserDto'
import type { ChallengingService } from '../interfaces'
import { User } from '../../global/domain/entities'
import { Solution } from '../domain/entities'
import { Id } from '#global/domain/structures/Id'

type Request = {
  userDto: UserDto
  solutionId: string
}

type Response = Promise<{
  upvotesCount: number
  userUpvotedSolutionsIds: string[]
}>

export class UpvoteSolutionUseCase implements UseCase<Request, Response> {
  constructor(private readonly challengingService: ChallengingService) {}

  async do({ userDto, solutionId }: Request) {
    const user = User.create(userDto)
    const solution = await this.fetchSolution(Id.create(solutionId))
    const isSolutionUpvoted = user.hasUpvotedSolution(solution.id)

    if (isSolutionUpvoted.isTrue) {
      user.removeUpvoteSolution(solution.id)
      const response = await this.challengingService.deleteSolutionUpvote(
        solution.id,
        user.id,
      )
      if (response.isFailure) response.throwError()
    }

    if (isSolutionUpvoted.isFalse) {
      user.upvoteSolution(solution.id)
      const response = await this.challengingService.saveSolutionUpvote(
        solution.id,
        user.id,
      )
      if (response.isFailure) response.throwError()
    }

    return {
      upvotesCount: solution.upvotesCount.value,
      userUpvotedSolutionsIds: user.upvotedSolutionsIds.dto,
    }
  }

  private async fetchSolution(solutionId: Id) {
    const response = await this.challengingService.fetchSolutionById(solutionId)
    if (response.isFailure) response.throwError()
    return Solution.create(response.body)
  }
}
