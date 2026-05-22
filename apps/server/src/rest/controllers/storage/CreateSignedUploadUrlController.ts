import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { CreateSignedUploadUrl } from '@stardust/core/storage/use-cases'

type Schema = {
  body: {
    folderPath: string
    fileName: string
  }
}

export class CreateSignedUploadUrlController implements Controller {
  constructor(private readonly createSignedUploadUrl: CreateSignedUploadUrl) {}

  async handle(http: Http<Schema>) {
    const { folderPath, fileName } = await http.getBody()
    const signedUploadUrl = await this.createSignedUploadUrl.execute({
      folderPath,
      fileName,
    })

    return http.statusOk().send(signedUploadUrl)
  }
}
