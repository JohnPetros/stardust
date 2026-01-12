import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Text } from '#global/domain/structures/Text'
import { Period } from '#global/domain/structures/Period'
import { ListingOrder } from '#global/domain/structures/ListingOrder'
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
  levelOrder: string
  weeklyXpOrder: string
  unlockedStarCountOrder: string
  unlockedAchievementCountOrder: string
  completedChallengeCountOrder: string
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
    levelOrder,
    weeklyXpOrder,
    unlockedStarCountOrder,
    unlockedAchievementCountOrder,
    completedChallengeCountOrder,
    spaceCompletionStatus,
    insigniaRoles,
    createdAtStartDate,
    createdAtEndDate,
  }: Request): Response {
    const { items, count } = await this.repository.findMany({
      search: Text.create(search),
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      levelOrder: ListingOrder.create(levelOrder),
      weeklyXpOrder: ListingOrder.create(weeklyXpOrder),
      unlockedStarCountOrder: ListingOrder.create(unlockedStarCountOrder),
      unlockedAchievementCountOrder: ListingOrder.create(unlockedAchievementCountOrder),
      completedChallengeCountOrder: ListingOrder.create(completedChallengeCountOrder),
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
