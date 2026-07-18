import { Id } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/index'
import type { ChallengeCodeExecutionsRepository } from '../interfaces'

type Request = {
  userId: string
  challengeId: string
}

type Response = Promise<number>

export class CountChallengeCodeExecutionErrorsUseCase
  implements UseCase<Request, Response>
{
  constructor(private readonly repository: ChallengeCodeExecutionsRepository) {}

  async execute(request: Request): Response {
    const count = await this.repository.countIncorrectByUserAndChallenge(
      Id.create(request.userId),
      Id.create(request.challengeId),
    )

    return count.value
  }
}
