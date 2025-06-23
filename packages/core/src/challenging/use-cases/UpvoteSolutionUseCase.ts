import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { SolutionNotFoundError } from '#challenging/domain/errors/SolutionNotFoundError'
import type { SolutionsRepository } from '../interfaces'

type Request = {
  solutionId: string
  userId: string
  isSolutionUpvoted: boolean
}

type Response = Promise<{
  upvotesCount: number
}>

export class UpvoteSolutionUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SolutionsRepository) {}

  async execute({ solutionId, userId: userIdValue, isSolutionUpvoted }: Request) {
    const userId = Id.create(userIdValue)
    const solution = await this.repository.findById(Id.create(solutionId))
    if (!solution) throw new SolutionNotFoundError()

    if (isSolutionUpvoted) {
      solution.removeUpvote()
      await this.repository.removeSolutionUpvote(solution.id, userId)
    } else {
      solution.upvote()
      await this.repository.addSolutionUpvote(solution.id, userId)
    }

    return {
      upvotesCount: solution.upvotesCount.value,
    }
  }
}
