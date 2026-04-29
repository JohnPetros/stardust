import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import { PaginationResponse } from '@stardust/core/global/responses'
import type { AvatarDto } from '@stardust/core/shop/entities/dtos'
import { ListAvatarsUseCase } from '@stardust/core/shop/use-cases'
import { FetchAvatarsListController } from '../FetchAvatarsListController'

type Schema = {
  queryParams: {
    search: string
    priceOrder: string
    page: number
    itemsPerPage: number
  }
}

describe('Fetch Avatars List Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<AvatarsRepository>
  let controller: FetchAvatarsListController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchAvatarsListController(repository)
  })

  it('should read query params and call list avatars use case', async () => {
    const queryParams = {
      search: 'astro',
      priceOrder: 'ascending',
      page: 2,
      itemsPerPage: 12,
    }

    const useCaseResponse = new PaginationResponse<AvatarDto>({
      items: [],
      totalItemsCount: 0,
      itemsPerPage: queryParams.itemsPerPage,
      page: queryParams.page,
    })

    const executeSpy = jest
      .spyOn(ListAvatarsUseCase.prototype, 'execute')
      .mockResolvedValue(useCaseResponse)

    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue(queryParams)
    http.sendPagination.mockReturnValue(restResponse)

    await controller.handle(http)

    expect(http.getQueryParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith(queryParams)
  })

  it('should return response from sendPagination', async () => {
    const queryParams = {
      search: '',
      priceOrder: 'descending',
      page: 1,
      itemsPerPage: 10,
    }

    const useCaseResponse = new PaginationResponse<AvatarDto>({
      items: [],
      totalItemsCount: 0,
      itemsPerPage: queryParams.itemsPerPage,
      page: queryParams.page,
    })

    jest.spyOn(ListAvatarsUseCase.prototype, 'execute').mockResolvedValue(useCaseResponse)

    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue(queryParams)
    http.sendPagination.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(http.sendPagination).toHaveBeenCalledWith(useCaseResponse)
    expect(response).toBe(restResponse)
  })
})
