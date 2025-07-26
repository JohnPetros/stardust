import { InngestFunctions } from './InngestFunctions'

import { BackupDatabaseJob } from '@/queue/jobs/storage'
import { SupabaseDatabaseProvider } from '@/provision/database'
import { DropboxStorageProvider } from '@/provision/storage'

export class StorageFunctions extends InngestFunctions {
  private backupDatabaseJob() {
    return this.inngest.createFunction(
      { id: BackupDatabaseJob.KEY },
      { cron: BackupDatabaseJob.CRON_EXPRESSION },
      async () => {
        const databaseProvider = new SupabaseDatabaseProvider()
        const storageProvider = new DropboxStorageProvider()
        const job = new BackupDatabaseJob(databaseProvider, storageProvider)
        return await job.handle()
      },
    )
  }

  getFunctions() {
    return [this.backupDatabaseJob()]
  }
}
