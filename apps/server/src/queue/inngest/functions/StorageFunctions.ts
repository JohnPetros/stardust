import type { DrizzleDatabase } from '@/database/drizzle/DrizzleClient'
import type { EventPayload } from '@stardust/core/global/types'

import { InngestFunctions } from './InngestFunctions'
import type {
  TextBlockAudioFileRemovedEvent,
  TextBlockAudioGenerationRequestedEvent,
} from '@stardust/core/lesson/events'

import {
  BackupStorageFilesJob,
  BackupDatabaseJob,
  GenerateTextBlockAudioJob,
  RemoveTextBlockAudioFileJob,
} from '@/queue/jobs/storage'
import { SupabaseDatabaseProvider } from '@/provision/database'
import { DropboxStorageProvider, S3FileStorageProvider } from '@/provision/storage'
import { OpenAITtsProvider } from '@/provision/tts'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { DrizzleTextBlocksRepository } from '@/database/drizzle/repositories'
import { InngestAmqp } from '../InngestAmqp'
import { InngestBroker } from '../InngestBroker'
import {
  TEXT_BLOCK_AUDIO_FILE_REMOVED_EVENT_NAME,
  TEXT_BLOCK_AUDIO_GENERATION_CANCELLED_EVENT_NAME,
  TEXT_BLOCK_AUDIO_GENERATION_REQUESTED_EVENT_NAME,
} from '../constants/lesson-event-names'
import { eventType } from './InngestFunctions'
import z from 'zod'
import { idSchema, stringSchema } from '@stardust/validation/global/schemas'
import { audioVoiceSchema } from '@stardust/validation/lesson/schemas'
import { createMarkTextBlockAudioAsErrorOnFailure } from '../createMarkTextBlockAudioAsErrorOnFailure'

type TextBlockAudioGenerationRequestedPayload = EventPayload<
  typeof TextBlockAudioGenerationRequestedEvent
>
type TextBlockAudioFileRemovedPayload = EventPayload<
  typeof TextBlockAudioFileRemovedEvent
>

export class StorageFunctions extends InngestFunctions {
  private createBackupDatabaseJob() {
    return this.createFunction(
      {
        id: BackupDatabaseJob.KEY,
        onFailure: (context) => this.handleFailure(context, BackupDatabaseJob.name),
        triggers: {
          cron: BackupDatabaseJob.CRON_EXPRESSION,
        },
      },
      async () => {
        const databaseProvider = new SupabaseDatabaseProvider()
        const restClient = new AxiosRestClient()
        const storageProvider = new DropboxStorageProvider(restClient)
        const job = new BackupDatabaseJob(databaseProvider, storageProvider)
        return await job.handle()
      },
    )
  }

  private createBackupStorageFilesJob() {
    return this.createFunction(
      {
        id: BackupStorageFilesJob.KEY,
        onFailure: (context) => this.handleFailure(context, BackupStorageFilesJob.name),
        triggers: {
          cron: BackupStorageFilesJob.CRON_EXPRESSION,
        },
      },
      async (context) => {
        const restClient = new AxiosRestClient()
        const sourceStorageProvider = new S3FileStorageProvider()
        const destinationStorageProviders = [new DropboxStorageProvider(restClient)]
        const job = new BackupStorageFilesJob(
          sourceStorageProvider,
          destinationStorageProviders,
        )
        const amqp = new InngestAmqp(context)
        return await job.handle(amqp)
      },
    )
  }

  private createGenerateTextBlockAudioJob(database: DrizzleDatabase) {
    return this.createFunction(
      {
        id: GenerateTextBlockAudioJob.KEY,
        retries: 2,
        concurrency: { limit: 3, key: 'event.data.starId' },
        cancelOn: [
          {
            event: TEXT_BLOCK_AUDIO_GENERATION_CANCELLED_EVENT_NAME,
            if: 'async.data.starId == event.data.starId && async.data.blockIndex == event.data.blockIndex',
          },
        ],
        onFailure: createMarkTextBlockAudioAsErrorOnFailure(
          database,
          async (context, jobName) => await this.handleFailure(context, jobName),
        ),
        triggers: {
          event: eventType(TEXT_BLOCK_AUDIO_GENERATION_REQUESTED_EVENT_NAME, {
            schema: z.object({
              starId: idSchema,
              blockIndex: z.number().int().min(0),
              content: stringSchema,
              voice: audioVoiceSchema,
              currentAudioFileName: stringSchema.nullable(),
            }),
          }),
        },
      },
      async (context) => {
        const repository = new DrizzleTextBlocksRepository(database, { kind: 'system' })
        const ttsProvider = new OpenAITtsProvider()
        const fileStorageProvider = new S3FileStorageProvider()
        const broker = new InngestBroker()
        const job = new GenerateTextBlockAudioJob(
          repository,
          ttsProvider,
          fileStorageProvider,
          broker,
        )
        const amqp = new InngestAmqp<TextBlockAudioGenerationRequestedPayload>(context)
        return await job.handle(amqp)
      },
    )
  }

  private createRemoveTextBlockAudioFileJob() {
    return this.createFunction(
      {
        id: RemoveTextBlockAudioFileJob.KEY,
        retries: 2,
        onFailure: (context) =>
          this.handleFailure(context, RemoveTextBlockAudioFileJob.name),
        triggers: {
          event: eventType(TEXT_BLOCK_AUDIO_FILE_REMOVED_EVENT_NAME, {
            schema: z.object({
              fileName: stringSchema,
            }),
          }),
        },
      },
      async (context) => {
        const fileStorageProvider = new S3FileStorageProvider()
        const job = new RemoveTextBlockAudioFileJob(fileStorageProvider)
        const amqp = new InngestAmqp<TextBlockAudioFileRemovedPayload>(context)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions(database: DrizzleDatabase) {
    return [
      this.createBackupDatabaseJob(),
      this.createBackupStorageFilesJob(),
      this.createGenerateTextBlockAudioJob(database),
      this.createRemoveTextBlockAudioFileJob(),
    ]
  }
}
