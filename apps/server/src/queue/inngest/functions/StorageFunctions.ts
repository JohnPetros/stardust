import { InngestFunctions } from './InngestFunctions'

import { BackupDatabaseJob } from '@/queue/jobs/storage'
import { SupabaseDatabaseProvider } from '@/provision/database'
import { GoogleDriveStorageProvider } from '@/provision/storage'

export class StorageFunctions extends InngestFunctions {
  private backupDatabaseJob() {
    return this.inngest.createFunction(
      { id: BackupDatabaseJob.KEY },
      { cron: BackupDatabaseJob.CRON_EXPRESSION },
      async () => {
        const databaseProvider = new SupabaseDatabaseProvider()
        const storageProvider = new GoogleDriveStorageProvider()
        const job = new BackupDatabaseJob(databaseProvider, storageProvider)
        return job.handle()
      },
    )
  }

  getFunctions() {
    return [this.backupDatabaseJob()]
  }
}
