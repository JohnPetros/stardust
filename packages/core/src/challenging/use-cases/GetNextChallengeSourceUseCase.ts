import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengeSourceDto } from '../domain/entities/dtos'
import type { ChallengeSourcesRepository } from '../interfaces'
import { ChallengeSourceNotFoundError } from '../domain/errors'

type Response = Promise<ChallengeSourceDto>

export class GetNextChallengeSourceUseCase implements UseCase<void, Response> {
  constructor(private readonly challengeSourcesRepository: ChallengeSourcesRepository) {}

  async execute(): Response {
    const challengeSource = await this.challengeSourcesRepository.findNextNotUsed()
    if (!challengeSource) throw new ChallengeSourceNotFoundError()
    return challengeSource.dto
  }
}
