import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import { OrdinalNumber, Text } from '@stardust/core/global/structures'
import { StorageFolder } from '@stardust/core/storage/structures'
import { PaginationResponse } from '@stardust/core/global/responses'

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

export class FetchImagesListController implements Controller {
  constructor(private readonly storageProvider: StorageProvider) {}

  async handle(http: Http<Schema>) {
    const { folder } = http.getRouteParams()
    const { page, itemsPerPage, search } = http.getQueryParams()
    const { files, totalFilesCount } = await this.storageProvider.listFiles({
      folder: StorageFolder.create(folder),
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      search: Text.create(search),
    })
    return http.statusOk().sendPagination(
      new PaginationResponse(
        files.map((file) => file.name),
        totalFilesCount,
        itemsPerPage,
      ),
    )
  }
}
