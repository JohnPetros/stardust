import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import type { StorageFolder } from '@stardust/core/storage/types'

type Schema = {
  routeParams: {
    folder: string
  }
}

export class UploadFileController implements Controller {
  constructor(private readonly storageProvider: StorageProvider) {}

  async handle(http: Http<Schema>) {
    const { folder } = http.getRouteParams()
    const file = await http.getFile()
    const uploadedFile = await this.storageProvider.upload(folder as StorageFolder, file)
    return http.statusCreated().send({ filename: uploadedFile.name })
  }
}
