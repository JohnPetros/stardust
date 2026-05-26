import { Text } from '#global/domain/structures/Text'
import type { UseCase } from '#global/interfaces/UseCase'
import { FileStorageFolderPath } from '../domain/structures'
import type { SignedUploadUrlDto } from '../domain/structures/dtos'
import { FileNameAlreadyExistsError } from '../errors'
import type { FileStorageProvider } from '../interfaces'

type Request = {
  folderPath: string
  fileName: string
}

type Response = Promise<SignedUploadUrlDto>

export class CreateSignedUploadUrl implements UseCase<Request, Response> {
  constructor(private readonly storageProvider: FileStorageProvider) {}

  async execute({ folderPath, fileName }: Request): Promise<SignedUploadUrlDto> {
    const storageFolderPath = FileStorageFolderPath.create(folderPath)
    const storageFileName = Text.create(fileName)
    const existingFile = await this.storageProvider.findFile(
      storageFolderPath,
      storageFileName,
    )

    if (existingFile) throw new FileNameAlreadyExistsError()

    const signedUploadUrl = await this.storageProvider.createSignedUploadUrl(
      storageFolderPath,
      storageFileName,
    )

    return signedUploadUrl.dto
  }
}
