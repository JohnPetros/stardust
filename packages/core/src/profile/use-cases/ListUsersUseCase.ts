import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Text } from '#global/domain/structures/Text'
import { Period } from '#global/domain/structures/Period'
import { Sorter } from '#global/domain/structures/Sorter'
import { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import type { UseCase } from '#global/interfaces/UseCase'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import type { UserDto } from '../domain/entities/dtos'
import type { UsersRepository } from '../interfaces'
import { SpaceCompletionStatus } from '../domain/structures/SpaceCompletionStatus'

type Request = {
  search: string
  page: number
  itemsPerPage: number
  levelSorter: string
  weeklyXpSorter: string
  unlockedStarCountSorter: string
  unlockedAchievementCountSorter: string
  completedChallengeCountSorter: string
  spaceCompletionStatus: string
  insigniaRoles: string[]
  createdAtStartDate?: string
  createdAtEndDate?: string
}

type Response = Promise<PaginationResponse<UserDto>>

export class ListUsersUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({
    search,
    page,
    itemsPerPage,
    levelSorter,
    weeklyXpSorter,
    unlockedStarCountSorter,
    unlockedAchievementCountSorter,
    completedChallengeCountSorter,
    spaceCompletionStatus,
    insigniaRoles,
    createdAtStartDate,
    createdAtEndDate,
  }: Request): Response {
    const { items, count } = await this.repository.findMany({
      search: Text.create(search),
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      levelSorter: Sorter.create(levelSorter),
      weeklyXpSorter: Sorter.create(weeklyXpSorter),
      unlockedStarCountSorter: Sorter.create(unlockedStarCountSorter),
      unlockedAchievementCountSorter: Sorter.create(unlockedAchievementCountSorter),
      completedChallengeCountSorter: Sorter.create(completedChallengeCountSorter),
      spaceCompletionStatus: SpaceCompletionStatus.create(spaceCompletionStatus),
      insigniaRoles: insigniaRoles.map(InsigniaRole.create),
      creationPeriod:
        createdAtStartDate && createdAtEndDate
          ? Period.create(createdAtStartDate, createdAtEndDate)
          : undefined,
    })

    return new PaginationResponse(
      items.map((user) => user.dto),
      count,
      itemsPerPage,
    )
  }
}
