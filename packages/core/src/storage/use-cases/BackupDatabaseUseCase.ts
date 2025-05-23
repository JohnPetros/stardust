import type { DatabaseProvider, UseCase } from '../../global/interfaces'
import type { StorageProvider } from '../interfaces'

export class BackupDatabaseUseCase implements UseCase {
  constructor(
    private readonly databaseProvider: DatabaseProvider,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute() {
    const backupFile = await this.databaseProvider.backup()
    await this.storageProvider.upload('database-backups', backupFile)
  }
}
