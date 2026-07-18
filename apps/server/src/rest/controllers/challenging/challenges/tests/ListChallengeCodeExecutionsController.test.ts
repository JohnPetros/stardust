import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengeCodeExecutionsRepository } from '@stardust/core/challenging/interfaces'
import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'
import { ListChallengeCodeExecutionsUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import { PaginationResponse, type RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { ListChallengeCodeExecutionsController } from '../ListChallengeCodeExecutionsController'

describe('List Challenge Code Executions Controller', () => {
  type Schema = {
    routeParams: {
      challengeId: string
    }
    queryParams: {
      page: number
      itemsPerPage: number
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengeCodeExecutionsRepository>
  let controller: ListChallengeCodeExecutionsController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new ListChallengeCodeExecutionsController(repository)
  })

  it('should list challenge code executions and send pagination', async () => {
    const userId = IdFaker.fake().value
    const challengeId = IdFaker.fake().value
    const queryParams = { page: 2, itemsPerPage: 20 }
    const execution = ChallengeCodeExecution.create({
      code: 'escreva("ok")',
      status: 'accepted',
      testResults: [],
      outputs: [],
      error: null,
    })
    const pagination = new PaginationResponse({
      items: [execution.dto],
      totalItemsCount: 1,
      page: queryParams.page,
      itemsPerPage: queryParams.itemsPerPage,
    })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ challengeId })
    http.getQueryParams.mockReturnValue(queryParams)
    http.getAccountId.mockResolvedValue(userId)
    http.sendPagination.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(ListChallengeCodeExecutionsUseCase.prototype, 'execute')
      .mockResolvedValue(pagination)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ userId, challengeId, ...queryParams })
    expect(http.sendPagination).toHaveBeenCalledWith(pagination)
    expect(response).toBe(restResponse)
  })
})
