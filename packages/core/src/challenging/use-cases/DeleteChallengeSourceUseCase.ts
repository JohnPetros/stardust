import { Id } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { ChallengeSourceNotFoundError } from '../domain/errors'
import type { ChallengeSourcesRepository } from '../interfaces'

type Request = {
  challengeSourceId: string
}

export class DeleteChallengeSourceUseCase implements UseCase<Request> {
  constructor(private readonly repository: ChallengeSourcesRepository) {}

  async execute({ challengeSourceId }: Request): Promise<void> {
    await this.findChallengeSource(Id.create(challengeSourceId))
    await this.repository.remove(Id.create(challengeSourceId))
  }

  private async findChallengeSource(challengeSourceId: Id) {
    const challengeSource = await this.repository.findById(challengeSourceId)
    if (!challengeSource) throw new ChallengeSourceNotFoundError()
    return challengeSource
  }
}
