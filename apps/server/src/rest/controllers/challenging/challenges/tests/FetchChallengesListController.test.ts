import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { ListChallengesUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import { PaginationResponse, type RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { FetchChallengesListController } from '../FetchChallengesListController'

describe('Fetch Challenges List Controller', () => {
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
      shouldIncludeOnlyAuthorChallenges: boolean
      shouldIncludePrivateChallenges: boolean
      userId?: string
      userCompletedChallengesIds?: string[]
    }
    body: {
      userCompletedChallengesIds?: string[]
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengesRepository>
  let controller: FetchChallengesListController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchChallengesListController(repository)
  })

  it('should call list use case using account id and send pagination', async () => {
    const accountId = IdFaker.fake().value
    const queryParams = {
      page: 1,
      itemsPerPage: 20,
      title: 'array',
      categoriesIds: [IdFaker.fake().value],
      difficulty: 'easy',
      upvotesCountOrder: 'desc',
      downvoteCountOrder: 'asc',
      completionCountOrder: 'desc',
      postingOrder: 'desc',
      completionStatus: 'all',
      isNewStatus: 'all',
      shouldIncludeOnlyAuthorChallenges: true,
      shouldIncludePrivateChallenges: true,
      userId: IdFaker.fake().value,
    }
    const userCompletedChallengesIds = [IdFaker.fake().value]
    const pagination = new PaginationResponse([ChallengesFaker.fakeDto()], 1)
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue(queryParams)
    http.getBody.mockResolvedValue({ userCompletedChallengesIds })
    http.getAccount.mockResolvedValue({ id: accountId } as never)
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
      downvoteCountOrder: queryParams.downvoteCountOrder,
      completionCountOrder: queryParams.completionCountOrder,
      postingOrder: queryParams.postingOrder,
      userId: queryParams.userId,
      userCompletedChallengesIds,
      title: queryParams.title,
      completionStatus: queryParams.completionStatus,
      isNewStatus: queryParams.isNewStatus,
      shouldIncludeOnlyAuthorChallenges: queryParams.shouldIncludeOnlyAuthorChallenges,
      shouldIncludePrivateChallenges: queryParams.shouldIncludePrivateChallenges,
      shouldIncludeStarChallenges: false,
    })
    expect(http.sendPagination).toHaveBeenCalledWith(pagination)
    expect(response).toBe(restResponse)
  })

  it('should call list use case with undefined account id when no account exists', async () => {
    const queryParams = {
      page: 1,
      itemsPerPage: 10,
      title: '',
      categoriesIds: [],
      difficulty: 'all',
      upvotesCountOrder: 'desc',
      downvoteCountOrder: 'desc',
      completionCountOrder: 'desc',
      postingOrder: 'desc',
      completionStatus: 'all',
      isNewStatus: 'all',
      shouldIncludeOnlyAuthorChallenges: false,
      shouldIncludePrivateChallenges: false,
      userId: undefined,
    }
    const pagination = new PaginationResponse([ChallengesFaker.fakeDto()], 1)
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue(queryParams)
    http.getBody.mockResolvedValue({})
    http.getAccount.mockResolvedValue(undefined as never)
    http.sendPagination.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(ListChallengesUseCase.prototype, 'execute')
      .mockResolvedValue(pagination)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: undefined,
        userCompletedChallengesIds: [],
      }),
    )
  })
})
