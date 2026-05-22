import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import { OrdinalNumber, Text } from '@stardust/core/global/structures'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'
import { PaginationResponse } from '@stardust/core/global/responses'

type Schema = {
  routeParams: {
    folder: string
  }
  queryParams: {
    page: number
    itemsPerPage: number
    search: string
    folder: string
  }
}

export class FetchFilesListController implements Controller {
  constructor(private readonly storageProvider: FileStorageProvider) {}

  async handle(http: Http<Schema>) {
    const { page, itemsPerPage, search, folder } = http.getQueryParams()
    const { items, count } = await this.storageProvider.listFiles({
      folder: FileStorageFolderPath.create(folder),
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      search: Text.create(search),
    })
    return http.statusOk().sendPagination(
      new PaginationResponse({
        items: items.map((file) => file.name),
        totalItemsCount: count,
        itemsPerPage,
        page,
      }),
    )
  }
}
