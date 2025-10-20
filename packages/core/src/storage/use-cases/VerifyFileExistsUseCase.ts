import type { UseCase } from '#global/interfaces/UseCase'
import type { StorageProvider } from '#storage/interfaces/StorageProvider'
import { Text } from '#global/domain/structures/Text'
import { StorageFolder } from '../structures'
import { FileNotFoundError } from '../errors'

type Request = {
  folder: string
  fileName: string
}

type Response = Promise<boolean>

export class VerifyFileExistsUseCase implements UseCase<Request, Response> {
  constructor(private readonly storageProvider: StorageProvider) {}

  async execute({ folder, fileName }: Request) {
    const file = await this.storageProvider.findFile(
      StorageFolder.create(folder),
      Text.create(fileName),
    )
    if (!file) throw new FileNotFoundError()
    return true
  }
}
