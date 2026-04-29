import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { PaginationResponse, type RestResponse } from '@stardust/core/global/responses'
import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import { RocketsFaker } from '@stardust/core/shop/entities/fakers'
import { ListRocketsUseCase } from '@stardust/core/shop/use-cases'

import { FetchRocketsListController } from '../FetchRocketsListController'

describe('Fetch Rockets List Controller', () => {
  type Schema = {
    queryParams: {
      search: string
      priceOrder: string
      page: number
      itemsPerPage: number
    }
  }

  let http: Mock<Http<Schema>>
  let rocketsRepository: Mock<RocketsRepository>
  let controller: FetchRocketsListController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    rocketsRepository = mock()
    controller = new FetchRocketsListController(rocketsRepository)
  })

  it('should extract query params and execute list rockets use case', async () => {
    const queryParams = {
      search: 'falcon',
      priceOrder: 'ascending',
      page: 2,
      itemsPerPage: 5,
    }
    const pagination = new PaginationResponse({
      items: [RocketsFaker.fake().dto],
      totalItemsCount: 1,
      page: queryParams.page,
      itemsPerPage: queryParams.itemsPerPage,
    })

    http.getQueryParams.mockReturnValue(queryParams)
    http.sendPagination.mockReturnValue(mock<RestResponse>())

    const executeSpy = jest
      .spyOn(ListRocketsUseCase.prototype, 'execute')
      .mockResolvedValue(pagination)

    await controller.handle(http)

    expect(http.getQueryParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith(queryParams)
  })

  it('should send pagination response from use case listing result', async () => {
    const queryParams = {
      search: '',
      priceOrder: 'descending',
      page: 1,
      itemsPerPage: 10,
    }
    const pagination = new PaginationResponse({
      items: RocketsFaker.fakeMany(2).map((rocket) => rocket.dto),
      totalItemsCount: 2,
      page: queryParams.page,
      itemsPerPage: queryParams.itemsPerPage,
    })
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue(queryParams)
    http.sendPagination.mockReturnValue(restResponse)

    jest.spyOn(ListRocketsUseCase.prototype, 'execute').mockResolvedValue(pagination)

    const response = await controller.handle(http)

    expect(http.sendPagination).toHaveBeenCalledWith(pagination)
    expect(response).toBe(restResponse)
  })
})
