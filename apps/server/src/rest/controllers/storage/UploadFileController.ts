import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import { StorageFolder } from '@stardust/core/storage/structures'

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
    console.log({ folder })
    const uploadedFile = await this.storageProvider.upload(
      StorageFolder.create(folder),
      file,
    )
    return http.statusCreated().send({ filename: uploadedFile.name })
  }
}
