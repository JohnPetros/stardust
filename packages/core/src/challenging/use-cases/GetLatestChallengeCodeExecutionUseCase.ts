import { Id } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/index'
import type { ChallengeCodeExecutionDto } from '../domain/structures/dtos'
import type { ChallengeCodeExecutionsRepository } from '../interfaces'

type Request = {
  userId: string
  challengeId: string
}

type Response = Promise<ChallengeCodeExecutionDto | null>

export class GetLatestChallengeCodeExecutionUseCase
  implements UseCase<Request, Response>
{
  constructor(private readonly repository: ChallengeCodeExecutionsRepository) {}

  async execute(request: Request): Response {
    const execution = await this.repository.findLatestByUserAndChallenge(
      Id.create(request.userId),
      Id.create(request.challengeId),
    )

    return execution?.dto ?? null
  }
}
