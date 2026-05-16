import type { UseCase } from '#global/interfaces/UseCase'
import type { FileStorageProvider } from '#storage/interfaces/FileStorageProvider'
import { Text } from '#global/domain/structures/Text'
import { FileStorageFolderPath } from '../domain/structures'
import { FileNotFoundError } from '../errors'

type Request = {
  folder: string
  fileName: string
}

type Response = Promise<boolean>

export class VerifyFileExistsUseCase implements UseCase<Request, Response> {
  constructor(private readonly storageProvider: FileStorageProvider) {}

  async execute({ folder, fileName }: Request) {
    const file = await this.storageProvider.findFile(
      FileStorageFolderPath.create(folder),
      Text.create(fileName),
    )
    if (!file) throw new FileNotFoundError()
    return true
  }
}
