import type { SupabaseClient } from '@supabase/supabase-js'

import type { EventPayload } from '@stardust/core/global/types'
import type {
  TextBlockAudioGeneratedEvent,
  TextBlockAudioGenerationCancelledEvent,
  TextBlocksAudioGenerationInBatchRequestedEvent,
} from '@stardust/core/lesson/events'

import type { Database } from '@/database/supabase/types/Database'
import { SupabaseTextBlocksRepository } from '@/database'
import {
  CancelTextBlockAudioGenerationJob,
  GenerateTextBlocksAudioBatchJob,
  UpdateTextBlockAudioJob,
} from '@/queue/jobs/lesson'
import { InngestAmqp } from '../InngestAmqp'
import { InngestBroker } from '../InngestBroker'
import {
  TEXT_BLOCKS_AUDIO_GENERATION_IN_BATCH_REQUESTED_EVENT_NAME,
  TEXT_BLOCK_AUDIO_GENERATED_EVENT_NAME,
  TEXT_BLOCK_AUDIO_GENERATION_CANCELLED_EVENT_NAME,
} from '../constants/lesson-event-names'
import { InngestFunctions } from './InngestFunctions'
import { eventType } from 'inngest'
import z from 'zod'
import { idSchema, stringSchema } from '@stardust/validation/global/schemas'
import { audioVoiceSchema } from '@stardust/validation/lesson/schemas'

type TextBlocksAudioGenerationInBatchRequestedPayload = EventPayload<
  typeof TextBlocksAudioGenerationInBatchRequestedEvent
>
type TextBlockAudioGenerationCancelledPayload = EventPayload<
  typeof TextBlockAudioGenerationCancelledEvent
>
type TextBlockAudioGeneratedPayload = EventPayload<typeof TextBlockAudioGeneratedEvent>

export class LessonFunctions extends InngestFunctions {
  private createGenerateTextBlocksAudioBatchJob() {
    return this.inngest.createFunction(
      {
        id: GenerateTextBlocksAudioBatchJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, GenerateTextBlocksAudioBatchJob.name),
        triggers: {
          event: eventType(TEXT_BLOCKS_AUDIO_GENERATION_IN_BATCH_REQUESTED_EVENT_NAME, {
            schema: z.object({
              starId: idSchema,
              blocks: z.array(
                z.object({
                  blockIndex: z.number().int().min(0),
                  content: stringSchema,
                  voice: audioVoiceSchema,
                  currentAudioFileName: stringSchema.nullable(),
                }),
              ),
            }),
          }),
        },
      },
      async (context) => {
        const broker = new InngestBroker()
        const job = new GenerateTextBlocksAudioBatchJob(broker)
        const amqp = new InngestAmqp<TextBlocksAudioGenerationInBatchRequestedPayload>(
          context,
        )
        return await job.handle(amqp)
      },
    )
  }

  private createCancelTextBlockAudioGenerationJob(supabase: SupabaseClient<Database>) {
    return this.inngest.createFunction(
      {
        id: CancelTextBlockAudioGenerationJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, CancelTextBlockAudioGenerationJob.name),
        triggers: {
          event: eventType(TEXT_BLOCK_AUDIO_GENERATION_CANCELLED_EVENT_NAME, {
            schema: z.object({
              starId: idSchema,
              blockIndex: z.number().int().min(0),
            }),
          }),
        },
      },
      async (context) => {
        const repository = new SupabaseTextBlocksRepository(supabase)
        const job = new CancelTextBlockAudioGenerationJob(repository)
        const amqp = new InngestAmqp<TextBlockAudioGenerationCancelledPayload>(context)
        return await job.handle(amqp)
      },
    )
  }

  private createUpdateTextBlockAudioJob(supabase: SupabaseClient<Database>) {
    return this.inngest.createFunction(
      {
        id: UpdateTextBlockAudioJob.KEY,
        onFailure: (context) => this.handleFailure(context, UpdateTextBlockAudioJob.name),
        triggers: {
          event: eventType(TEXT_BLOCK_AUDIO_GENERATED_EVENT_NAME, {
            schema: z.object({
              starId: idSchema,
              blockIndex: z.number().int().min(0),
              voice: audioVoiceSchema,
              fileName: stringSchema,
            }),
          }),
        },
      },
      async (context) => {
        const repository = new SupabaseTextBlocksRepository(supabase)
        const job = new UpdateTextBlockAudioJob(repository)
        const amqp = new InngestAmqp<TextBlockAudioGeneratedPayload>(context)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient<Database>) {
    return [
      this.createGenerateTextBlocksAudioBatchJob(),
      this.createCancelTextBlockAudioGenerationJob(supabase),
      this.createUpdateTextBlockAudioJob(supabase),
    ]
  }
}
