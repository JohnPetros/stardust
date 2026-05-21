import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

type Schema = {
  routeParams: {
    folder: string
  }
}

export class UploadFileController implements Controller {
  constructor(private readonly storageProvider: FileStorageProvider) {}

  async handle(http: Http<Schema>) {
    const { folder } = http.getRouteParams()
    const file = await http.getFile()
    const uploadedFile = await this.storageProvider.upload(
      FileStorageFolderPath.create(folder),
      file,
    )
    return http.statusCreated().send({ filename: uploadedFile.name })
  }
}
