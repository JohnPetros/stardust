import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { Controller } from '@stardust/core/global/interfaces'
import { ListUsersUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  queryParams: {
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
}

export class FetchUsersListController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const request = http.getQueryParams()
    const useCase = new ListUsersUseCase(this.usersRepository)
    const response = await useCase.execute(request)
    return http.sendPagination(response)
  }
}
