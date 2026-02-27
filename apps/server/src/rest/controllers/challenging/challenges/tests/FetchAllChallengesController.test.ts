import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { ListChallengesUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import { PaginationResponse, type RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { FetchAllChallengesController } from '../FetchAllChallengesController'

describe('Fetch All Challenges Controller', () => {
  type Schema = {
    queryParams: {
      page: number
      itemsPerPage: number
      title: string
      categoriesIds: string[]
      difficulty: string
      upvotesCountOrder: string
      downvoteCountOrder: string
      completionCountOrder: string
      postingOrder: string
      completionStatus: string
      isNewStatus: string
      userId?: string
      userCompletedChallengesIds?: string[]
    }
    body: {
      userCompletedChallengesIds?: string[]
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengesRepository>
  let controller: FetchAllChallengesController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchAllChallengesController(repository)
  })

  it('should call list challenges use case and send paginated response', async () => {
    const accountId = IdFaker.fake().value
    const userId = IdFaker.fake().value
    const categoryId = IdFaker.fake().value
    const userCompletedChallengesIds = [IdFaker.fake().value]
    const queryParams = {
      page: 2,
      itemsPerPage: 12,
      title: 'sorting',
      categoriesIds: [categoryId],
      difficulty: 'medium',
      upvotesCountOrder: 'desc',
      downvoteCountOrder: 'asc',
      completionCountOrder: 'desc',
      postingOrder: 'desc',
      completionStatus: 'completed',
      isNewStatus: 'all',
      userId,
    }
    const pagination = new PaginationResponse([ChallengesFaker.fakeDto()], 1)
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue(queryParams)
    http.getBody.mockResolvedValue({ userCompletedChallengesIds })
    http.getAccountId.mockResolvedValue(accountId)
    http.sendPagination.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(ListChallengesUseCase.prototype, 'execute')
      .mockResolvedValue(pagination)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      accountId,
      page: queryParams.page,
      itemsPerPage: queryParams.itemsPerPage,
      categoriesIds: queryParams.categoriesIds,
      difficulty: queryParams.difficulty,
      upvotesCountOrder: queryParams.upvotesCountOrder,
      postingOrder: queryParams.postingOrder,
      userId: queryParams.userId,
      userCompletedChallengesIds,
      title: queryParams.title,
      completionStatus: queryParams.completionStatus,
      isNewStatus: queryParams.isNewStatus,
      shouldIncludePrivateChallenges: true,
      shouldIncludeStarChallenges: false,
      shouldIncludeOnlyAuthorChallenges: false,
      completionCountOrder: queryParams.completionCountOrder,
      downvoteCountOrder: queryParams.downvoteCountOrder,
    })
    expect(http.sendPagination).toHaveBeenCalledWith(pagination)
    expect(response).toBe(restResponse)
  })
})
