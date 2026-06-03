import type { SupabaseClient } from '@supabase/supabase-js'

import { InngestFunctions } from './InngestFunctions'
import type { EventPayload } from '@stardust/core/global/types'

import { GuideContentEditedEvent, GuideDeletedEvent } from '@stardust/core/manual/events'
import type { TextBlockAudioGenerationRequestedEvent } from '@stardust/core/lesson/events'

import {
  BackupDatabaseJob,
  DeleteGuideEmbeddingsJob,
  GenerateGuideEmbeddingsJob,
  GenerateTextBlockAudioJob,
} from '@/queue/jobs/storage'
import type { Database } from '@/database/supabase/types/Database'
import { SupabaseDatabaseProvider } from '@/provision/database'
import { DropboxStorageProvider, SupabaseFileStorageProvider } from '@/provision/storage'
import { ElevenLabsTtsProvider } from '@/provision/tts'
import { MastraMarkdownEmbeddingsGeneratorProvider } from '@/provision/storage/MastraMarkdownEmbeddingsGeneratorProvider'
import { UpstashEmbeddingsStorageProvider } from '@/provision/storage/UpstashEmbeddingsStorageProvider'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { SupabaseTextBlocksRepository } from '@/database'
import { InngestAmqp } from '../InngestAmqp'
import { InngestBroker } from '../InngestBroker'
import {
  TEXT_BLOCK_AUDIO_GENERATION_CANCELLED_EVENT_NAME,
  TEXT_BLOCK_AUDIO_GENERATION_REQUESTED_EVENT_NAME,
} from '../constants/lesson-event-names'
import { eventType } from 'inngest'
import z from 'zod'
import { idSchema, stringSchema } from '@stardust/validation/global/schemas'
import { audioVoiceSchema } from '@stardust/validation/lesson/schemas'
import { createMarkTextBlockAudioAsErrorOnFailure } from '../createMarkTextBlockAudioAsErrorOnFailure'

type GuideContentEditedPayload = EventPayload<typeof GuideContentEditedEvent>
type GuideDeletedPayload = EventPayload<typeof GuideDeletedEvent>
type TextBlockAudioGenerationRequestedPayload = EventPayload<
  typeof TextBlockAudioGenerationRequestedEvent
>

export class StorageFunctions extends InngestFunctions {
  private createGenerateGuideEmbeddingsJob() {
    return this.inngest.createFunction(
      {
        id: GenerateGuideEmbeddingsJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, GenerateGuideEmbeddingsJob.name),
        triggers: {
          event: eventType(GuideContentEditedEvent._NAME, {
            schema: z.object({
              guideId: idSchema,
              guideContent: stringSchema,
            }),
          }),
        },
      },
      async (context) => {
        const generatorProvider = new MastraMarkdownEmbeddingsGeneratorProvider()
        const storageProvider = new UpstashEmbeddingsStorageProvider()
        const job = new GenerateGuideEmbeddingsJob(generatorProvider, storageProvider)
        const amqp = new InngestAmqp<GuideContentEditedPayload>(context)
        return await job.handle(amqp)
      },
    )
  }

  private createBackupDatabaseJob() {
    return this.inngest.createFunction(
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

  private createDeleteGuideEmbeddingsJob() {
    return this.inngest.createFunction(
      {
        id: DeleteGuideEmbeddingsJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, DeleteGuideEmbeddingsJob.name),
        triggers: {
          event: eventType(GuideDeletedEvent._NAME, {
            schema: z.object({
              guideId: idSchema,
            }),
          }),
        },
      },
      async (context) => {
        const storageProvider = new UpstashEmbeddingsStorageProvider()
        const job = new DeleteGuideEmbeddingsJob(storageProvider)
        const amqp = new InngestAmqp<GuideDeletedPayload>(context)
        return await job.handle(amqp)
      },
    )
  }

  private createGenerateTextBlockAudioJob(supabase: SupabaseClient<Database>) {
    return this.inngest.createFunction(
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
          supabase,
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
        const repository = new SupabaseTextBlocksRepository(supabase)
        const ttsProvider = new ElevenLabsTtsProvider()
        const fileStorageProvider = new SupabaseFileStorageProvider(supabase)
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

  getFunctions(supabase: SupabaseClient<Database>) {
    return [
      this.createGenerateGuideEmbeddingsJob(),
      this.createDeleteGuideEmbeddingsJob(),
      this.createBackupDatabaseJob(),
      this.createGenerateTextBlockAudioJob(supabase),
    ]
  }
}
