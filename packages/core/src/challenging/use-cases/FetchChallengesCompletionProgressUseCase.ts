import type { UseCase } from '#global/interfaces/UseCase'
import { IdsList } from '#global/domain/structures/IdsList'
import { ChallengesCompletion, type ChallengesCompletionDto } from '../domain/structures'
import type { ChallengesRepository } from '../interfaces'

type Request = {
  userCompletedChallengesIds: string[]
}

type Response = Promise<ChallengesCompletionDto>

export class FetchChallengesCompletionProgressUseCase
  implements UseCase<Request, Response>
{
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ userCompletedChallengesIds }: Request) {
    const completedChallengesIds = IdsList.create(userCompletedChallengesIds)
    const totalChallengesCount = await this.repository.countPublicChallenges()

    return ChallengesCompletion.create({
      completedChallengesCount: completedChallengesIds.count.value,
      totalChallengesCount: totalChallengesCount.value,
    }).dto
  }
}
