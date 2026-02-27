import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengesRepository } from '../interfaces'

export class ExpireNewChallengesUseCase implements UseCase<void, void> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute() {
    await this.repository.expireNewChallengesOlderThanOneWeek()
  }
}
