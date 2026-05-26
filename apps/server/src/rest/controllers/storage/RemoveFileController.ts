import { Text } from '@stardust/core/global/structures'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

type Schema = {
  queryParams: {
    fileName: string
    folder: string
  }
}

export class RemoveFileController implements Controller {
  constructor(private readonly storageProvider: FileStorageProvider) {}

  async handle(http: Http<Schema>) {
    const { fileName, folder } = http.getQueryParams()
    await this.storageProvider.removeFile(
      FileStorageFolderPath.create(folder),
      Text.create(fileName),
    )
    return http.statusNoContent().send()
  }
}
