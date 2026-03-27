import type { UseCase } from '#global/interfaces/UseCase'
import { IdsList } from '#global/domain/structures/IdsList'
import type { ChallengesNavigationSidebarProgressDto } from '../domain/types'
import type { ChallengesRepository } from '../interfaces'

type Request = {
  userCompletedChallengesIds: string[]
}

type Response = Promise<ChallengesNavigationSidebarProgressDto>

export class GetChallengesNavigationSidebarProgressUseCase
  implements UseCase<Request, Response>
{
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ userCompletedChallengesIds }: Request) {
    const completedChallengesIds = IdsList.create(userCompletedChallengesIds)
    const totalChallengesCount =
      await this.repository.countAllChallengesForNavigationSidebar()

    return {
      completedChallengesCount: completedChallengesIds.count.value,
      totalChallengesCount: totalChallengesCount.value,
    }
  }
}
