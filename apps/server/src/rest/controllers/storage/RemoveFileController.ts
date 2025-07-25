import { Text } from '@stardust/core/global/structures'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import type { StorageFolder } from '@stardust/core/storage/types'

type Schema = {
  routeParams: {
    fileName: string
    folder: string
  }
}

export class RemoveFileController implements Controller {
  constructor(private readonly storageProvider: StorageProvider) {}

  async handle(http: Http<Schema>) {
    const { fileName, folder } = http.getRouteParams()
    await this.storageProvider.removeFile(folder as StorageFolder, Text.create(fileName))
    return http.statusNoContent().send()
  }
}
