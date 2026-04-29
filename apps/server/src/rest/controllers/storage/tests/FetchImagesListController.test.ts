import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { PaginationResponse, type RestResponse } from '@stardust/core/global/responses'
import type { StorageProvider } from '@stardust/core/storage/interfaces'

import { FetchImagesListController } from '../FetchImagesListController'

describe('Fetch Images List Controller', () => {
  type Schema = {
    routeParams: {
      folder: string
    }
    queryParams: {
      page: number
      itemsPerPage: number
      search: string
    }
  }

  let http: Mock<Http<Schema>>
  let storageProvider: Mock<StorageProvider>
  let controller: FetchImagesListController

  beforeEach(() => {
    http = mock()
    storageProvider = mock()
    controller = new FetchImagesListController(storageProvider)
    http.statusOk.mockReturnValue(http)
  })

  it('should extract route and query params, call provider and send paginated file names', async () => {
    const routeParams = { folder: 'avatars' }
    const queryParams = { page: 2, itemsPerPage: 3, search: 'profile' }
    const listedFiles = [
      { name: 'img-1.png' } as File,
      { name: 'img-2.jpg' } as File,
      { name: 'img-3.webp' } as File,
    ]
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue(routeParams)
    http.getQueryParams.mockReturnValue(queryParams)
    http.sendPagination.mockReturnValue(restResponse)
    storageProvider.listFiles.mockResolvedValue({
      items: listedFiles,
      count: listedFiles.length,
    })

    const result = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(http.getQueryParams).toHaveBeenCalledTimes(1)
    expect(storageProvider.listFiles).toHaveBeenCalledWith(
      expect.objectContaining({
        folder: expect.objectContaining({ name: routeParams.folder }),
        page: expect.objectContaining({ value: queryParams.page }),
        itemsPerPage: expect.objectContaining({ value: queryParams.itemsPerPage }),
        search: expect.objectContaining({ value: queryParams.search }),
      }),
    )
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.sendPagination).toHaveBeenCalledWith(
      new PaginationResponse({
        items: listedFiles.map((file) => file.name),
        totalItemsCount: listedFiles.length,
        itemsPerPage: queryParams.itemsPerPage,
        page: queryParams.page,
      }),
    )
    expect(result).toBe(restResponse)
  })

  it('should send empty pagination when provider returns no files', async () => {
    const routeParams = { folder: 'planets' }
    const queryParams = { page: 1, itemsPerPage: 10, search: '' }

    http.getRouteParams.mockReturnValue(routeParams)
    http.getQueryParams.mockReturnValue(queryParams)
    http.sendPagination.mockReturnValue(mock<RestResponse>())
    storageProvider.listFiles.mockResolvedValue({ items: [], count: 0 })

    await controller.handle(http)

    expect(storageProvider.listFiles).toHaveBeenCalledWith(
      expect.objectContaining({
        folder: expect.objectContaining({ name: routeParams.folder }),
        page: expect.objectContaining({ value: queryParams.page }),
        itemsPerPage: expect.objectContaining({ value: queryParams.itemsPerPage }),
        search: expect.objectContaining({ value: queryParams.search }),
      }),
    )
    expect(http.sendPagination).toHaveBeenCalledWith(
      new PaginationResponse({
        items: [],
        totalItemsCount: 0,
        itemsPerPage: queryParams.itemsPerPage,
        page: queryParams.page,
      }),
    )
  })
})
