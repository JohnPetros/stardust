import type { DatabaseProvider, UseCase } from '../../global/interfaces'
import type { FileStorageProvider } from '../interfaces'
import { FileStorageFolderPath } from '../domain/structures'

export class BackupDatabaseUseCase implements UseCase {
  constructor(
    private readonly databaseProvider: DatabaseProvider,
    private readonly storageProvider: FileStorageProvider,
  ) {}

  async execute() {
    const backupFile = await this.databaseProvider.backup()
    await this.storageProvider.upload(
      FileStorageFolderPath.createAsDatabaseBackups(),
      backupFile,
    )
  }
}
