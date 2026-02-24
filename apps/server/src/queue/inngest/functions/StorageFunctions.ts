import { InngestFunctions } from './InngestFunctions'

import { GuideContentEditedEvent, GuideDeletedEvent } from '@stardust/core/manual/events'

import {
  BackupDatabaseJob,
  GenerateGuideEmbeddingsJob,
  DeleteGuideEmbeddingsJob,
} from '@/queue/jobs/storage'
import { SupabaseDatabaseProvider } from '@/provision/database'
import { DropboxStorageProvider } from '@/provision/storage'
import { MastraMarkdownEmbeddingsGeneratorProvider } from '@/provision/storage/MastraMarkdownEmbeddingsGeneratorProvider'
import { UpstashEmbeddingsStorageProvider } from '@/provision/storage/UpstashEmbeddingsStorageProvider'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { InngestAmqp } from '../InngestAmqp'

export class StorageFunctions extends InngestFunctions {
  private createGenerateGuideEmbeddingsJob() {
    return this.inngest.createFunction(
      {
        id: GenerateGuideEmbeddingsJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, GenerateGuideEmbeddingsJob.name),
      },
      { event: GuideContentEditedEvent._NAME },
      async (context) => {
        const generatorProvider = new MastraMarkdownEmbeddingsGeneratorProvider()
        const storageProvider = new UpstashEmbeddingsStorageProvider()
        const job = new GenerateGuideEmbeddingsJob(generatorProvider, storageProvider)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        return await job.handle(amqp)
      },
    )
  }

  private createBackupDatabaseJob() {
    return this.inngest.createFunction(
      {
        id: BackupDatabaseJob.KEY,
        onFailure: (context) => this.handleFailure(context, BackupDatabaseJob.name),
      },
      { cron: BackupDatabaseJob.CRON_EXPRESSION },
      async (context) => {
        const databaseProvider = new SupabaseDatabaseProvider()
        const restClient = new AxiosRestClient()
        const storageProvider = new DropboxStorageProvider(restClient)
        const job = new BackupDatabaseJob(databaseProvider, storageProvider)
        return await job.handle()
      },
    )
  }

  private createDeleteGuideEmbeddingsJob() {
    return this.inngest.createFunction(
      {
        id: DeleteGuideEmbeddingsJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, DeleteGuideEmbeddingsJob.name),
      },
      { event: GuideDeletedEvent._NAME },
      async (context) => {
        const storageProvider = new UpstashEmbeddingsStorageProvider()
        const job = new DeleteGuideEmbeddingsJob(storageProvider)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions() {
    return [
      this.createGenerateGuideEmbeddingsJob(),
      this.createDeleteGuideEmbeddingsJob(),
      this.createBackupDatabaseJob(),
    ]
  }
}
