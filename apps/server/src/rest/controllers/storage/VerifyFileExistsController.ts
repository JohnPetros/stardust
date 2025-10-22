import type { Http } from '@stardust/core/global/interfaces'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import { VerifyFileExistsUseCase } from '@stardust/core/storage/use-cases'

type Schema = {
  body: {
    fileName: string
  }
}

export class VerifyFileExistsController {
  constructor(
    private readonly folder: string,
    private readonly storageProvider: StorageProvider,
  ) {}

  async handle(http: Http<Schema>) {
    const { fileName } = await http.getBody()
    const useCase = new VerifyFileExistsUseCase(this.storageProvider)
    await useCase.execute({ folder: this.folder, fileName })
    await http.pass()
  }
}
