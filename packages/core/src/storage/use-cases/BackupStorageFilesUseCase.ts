import { AppError } from '#global/domain/errors/index'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Text } from '#global/domain/structures/Text'
import type { UseCase } from '#global/interfaces/UseCase'
import { FileStorageFolderPath } from '../domain/structures'
import type { FileStorageProvider } from '../interfaces'

export class BackupStorageFilesUseCase implements UseCase {
  private static readonly ITEMS_PER_PAGE = OrdinalNumber.create(100)
  private static readonly ELIGIBLE_FOLDERS = [
    FileStorageFolderPath.createAsImagesStory(),
    FileStorageFolderPath.createAsAudiosStory(),
    FileStorageFolderPath.createAsImagesPlanets(),
    FileStorageFolderPath.createAsImagesRockets(),
    FileStorageFolderPath.createAsImagesAvatars(),
    FileStorageFolderPath.createAsImagesAchievements(),
    FileStorageFolderPath.createAsImagesRankings(),
    FileStorageFolderPath.createAsImagesInsignias(),
    FileStorageFolderPath.createAsImagesFeedbackReports(),
  ] as const

  constructor(
    private readonly sourceStorageProvider: FileStorageProvider,
    private readonly destinationStorageProviders: FileStorageProvider[],
  ) {}

  async execute(): Promise<void> {
    const failures: string[] = []

    for (const folder of BackupStorageFilesUseCase.ELIGIBLE_FOLDERS) {
      const folderFailures = await this.backupFolder(folder)
      failures.push(...folderFailures)
    }

    if (failures.length > 0) {
      throw new AppError(
        `Storage backup completed with failures: ${failures.join('; ')}`,
        'Storage Backup Failed',
      )
    }
  }

  private async listAllFiles(folder: FileStorageFolderPath): Promise<File[]> {
    const files: File[] = []
    let page = OrdinalNumber.create(1)

    while (true) {
      const response = await this.sourceStorageProvider.listFiles({
        folder,
        page,
        itemsPerPage: BackupStorageFilesUseCase.ITEMS_PER_PAGE,
        search: Text.create(''),
      })

      files.push(...response.items)

      const hasReachedLastPage =
        response.items.length === 0 ||
        page.value * BackupStorageFilesUseCase.ITEMS_PER_PAGE.value >= response.count

      if (hasReachedLastPage) {
        return files
      }

      page = page.increment()
    }
  }

  private async backupFolder(folder: FileStorageFolderPath): Promise<string[]> {
    try {
      const files = await this.listAllFiles(folder)

      if (files.length === 0) {
        return []
      }

      return await this.uploadFilesToDestinations(folder, files)
    } catch (error) {
      return [this.formatFailureMessage(folder.value, error)]
    }
  }

  private async uploadFilesToDestinations(
    folder: FileStorageFolderPath,
    files: File[],
  ): Promise<string[]> {
    const failures: string[] = []

    for (const destinationStorageProvider of this.destinationStorageProviders) {
      try {
        await destinationStorageProvider.uploadMany(folder, files)
      } catch (error) {
        const providerName = destinationStorageProvider.constructor.name
        failures.push(
          this.formatFailureMessage(`${folder.value} -> ${providerName}`, error),
        )
      }
    }

    return failures
  }

  private formatFailureMessage(context: string, error: unknown): string {
    const message = error instanceof Error ? error.message : 'Unknown error'

    return `${context}: ${message}`
  }
}
