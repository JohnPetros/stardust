import { OrdinalNumber, Text } from '@stardust/core/global/structures'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import type { StorageFolder } from '@stardust/core/storage/types'

type Schema = {
  queryParams: {
    folder: string
    page: number
    itemsPerPage: number
    search: string
  }
}

export class FetchImagesListController implements Controller {
  constructor(private readonly storageProvider: StorageProvider) {}

  async handle(http: Http<Schema>) {
    const { folder, page, itemsPerPage, search } = http.getQueryParams()
    const files = await this.storageProvider.listFiles({
      folder: folder as StorageFolder,
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      search: Text.create(search),
    })
    const images = files.map((file) => file.name)
    return http.statusOk().send(images)
  }
}
