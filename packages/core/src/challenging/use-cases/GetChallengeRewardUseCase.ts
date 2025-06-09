import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import { ChallengeNotFoundError } from '../domain/errors'
import type { ChallengesRepository } from '../interfaces'

type Request = {
  challengeId: string
}

type Response = Promise<{
  xp: number
  coins: number
}>

export class GetChallengeRewardUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ challengeId }: Request) {
    const challenge = await this.repository.findById(Id.create(challengeId))
    if (!challenge) throw new ChallengeNotFoundError()

    return {
      xp: challenge.difficulty.reward.xp,
      coins: challenge.difficulty.reward.coins,
    }
  }
}
