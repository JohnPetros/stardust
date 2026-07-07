import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import { BackupStorageFilesUseCase } from '@stardust/core/storage/use-cases'

export class BackupStorageFilesJob implements Job {
  static readonly KEY = 'storage/backup.files'
  static readonly CRON_EXPRESSION = 'TZ=America/Sao_Paulo 0 0 * * 0'

  constructor(
    private readonly sourceStorageProvider: FileStorageProvider,
    private readonly destinationStorageProviders: FileStorageProvider[],
  ) {}

  async handle(amqp: Amqp): Promise<void> {
    const useCase = new BackupStorageFilesUseCase(
      this.sourceStorageProvider,
      this.destinationStorageProviders,
    )

    return await amqp.run(
      async () => await useCase.execute(),
      BackupStorageFilesUseCase.name,
    )
  }
}
