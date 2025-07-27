import type { DatabaseProvider, Job } from '@stardust/core/global/interfaces'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import { BackupDatabaseUseCase } from '@stardust/core/storage/use-cases'

export class BackupDatabaseJob implements Job {
  static readonly KEY = 'storage/backup.database'
  static readonly CRON_EXPRESSION = 'TZ=America/Sao_Paulo 0 0 * * 0'

  constructor(
    private readonly databaseProvider: DatabaseProvider,
    private readonly storageProvider: StorageProvider,
  ) {}

  async handle(): Promise<void> {
    const useCase = new BackupDatabaseUseCase(this.databaseProvider, this.storageProvider)
    await useCase.execute()
  }
}
