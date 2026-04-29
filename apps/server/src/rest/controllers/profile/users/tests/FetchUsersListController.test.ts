import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { PaginationResponse, type RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import { ListUsersUseCase } from '@stardust/core/profile/use-cases'

import { FetchUsersListController } from '../FetchUsersListController'

describe('Fetch Users List Controller', () => {
  type Schema = {
    queryParams: {
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
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<UsersRepository>
  let controller: FetchUsersListController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchUsersListController(repository)
  })

  it('should execute list users use case with query params and return pagination response', async () => {
    const queryParams = {
      search: 'astro',
      page: 1,
      itemsPerPage: 10,
      levelOrder: 'descending',
      weeklyXpOrder: 'ascending',
      unlockedStarCountOrder: 'all',
      unlockedAchievementCountOrder: 'all',
      completedChallengeCountOrder: 'descending',
      spaceCompletionStatus: 'all',
      insigniaRoles: ['god'],
      createdAtStartDate: '2026-01-01',
      createdAtEndDate: '2026-01-31',
    }
    const pagination = new PaginationResponse({
      items: [UsersFaker.fakeDto()],
      totalItemsCount: 1,
      page: queryParams.page,
      itemsPerPage: queryParams.itemsPerPage,
    })
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue(queryParams)
    http.sendPagination.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(ListUsersUseCase.prototype, 'execute')
      .mockResolvedValue(pagination)

    const response = await controller.handle(http)

    expect(http.getQueryParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith(queryParams)
    expect(http.sendPagination).toHaveBeenCalledWith(pagination)
    expect(response).toBe(restResponse)
  })
})
