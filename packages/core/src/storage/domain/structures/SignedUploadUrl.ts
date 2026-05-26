import { Text } from '#global/domain/structures/Text'
import { Url } from '#global/domain/structures/Url'
import { FileStorageFolderPath } from './FileStorageFolderPath'
import type { SignedUploadUrlDto } from './dtos/SignedUploadUrlDto'

export class SignedUploadUrl {
  private static readonly ALLOWED_EXTENSIONS_BY_FOLDER: Record<string, string[]> = {
    'images/story': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
    'images/avatars': ['.png', '.jpg', '.jpeg', '.svg'],
    'images/rockets': ['.png', '.jpg', '.jpeg', '.svg'],
    'images/planets': ['.png', '.jpg', '.jpeg', '.svg'],
    'images/achievements': ['.png', '.jpg', '.jpeg', '.svg'],
    'images/rankings': ['.png', '.jpg', '.jpeg', '.svg'],
    'images/insignias': ['.png', '.jpg', '.jpeg', '.svg'],
    'images/feedback-reports': ['.png', '.jpg', '.jpeg', '.webp'],
    'audios/story': ['.mp3', '.wav', '.ogg'],
    'database-backups': ['.sql', '.dump', '.backup'],
  }

  private constructor(
    readonly url: Url,
    readonly folderPath: FileStorageFolderPath,
    readonly fileName: Text,
  ) {}

  static create(dto: SignedUploadUrlDto): SignedUploadUrl {
    SignedUploadUrl.validateFileExtension(dto.folderPath, dto.fileName)

    return new SignedUploadUrl(
      Url.create(dto.url),
      FileStorageFolderPath.create(dto.folderPath),
      Text.create(dto.fileName),
    )
  }

  get dto(): SignedUploadUrlDto {
    return {
      url: this.url.value,
      folderPath: this.folderPath.value,
      fileName: this.fileName.value,
    }
  }

  private static validateFileExtension(folderPath: string, fileName: string): void {
    const extensions = SignedUploadUrl.ALLOWED_EXTENSIONS_BY_FOLDER[folderPath]
    if (!extensions) return

    const normalizedFileName = fileName.trim().toLowerCase()
    const isAllowed = extensions.some((extension) =>
      normalizedFileName.endsWith(extension),
    )

    if (!isAllowed) {
      throw new Error(`Invalid file extension for folder path: ${folderPath}`)
    }
  }
}
