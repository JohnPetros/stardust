import type { SupabaseClient } from '@supabase/supabase-js'

import { Id, Integer } from '@stardust/core/global/structures'
import type { EventPayload } from '@stardust/core/global/types'
import {
  TextBlockAudioGeneratedEvent,
  TextBlockAudioGenerationCancelledEvent,
  TextBlockAudioGenerationRequestedEvent,
  TextBlocksAudioGenerationInBatchRequestedEvent,
} from '@stardust/core/lesson/events'

import type { Database } from '@/database/supabase/types/Database'
import { SupabaseTextBlocksRepository } from '@/database'
import {
  CancelTextBlockAudioGenerationJob,
  GenerateTextBlocksAudioBatchJob,
  MarkTextBlockAudioAsErrorJob,
  UpdateTextBlockAudioJob,
} from '@/queue/jobs/lesson'
import { InngestAmqp } from '../InngestAmqp'
import { InngestBroker } from '../InngestBroker'
import { InngestFunctions } from './InngestFunctions'
import { GenerateTextBlockAudioJob } from '@/queue/jobs/storage'
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
          event: eventType(TextBlocksAudioGenerationInBatchRequestedEvent._NAME, {
            schema: z.object({
              starId: idSchema,
              blocks: z.array(
                z.object({
                  blockIndex: z.number().int().min(0),
                  content: stringSchema,
                  voice: audioVoiceSchema,
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
          event: eventType(TextBlockAudioGenerationCancelledEvent._NAME, {
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
          event: eventType(TextBlockAudioGeneratedEvent._NAME, {
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

  createMarkTextBlockAudioAsErrorFunction(supabase: SupabaseClient<Database>) {
    return async (context: {
      error: unknown
      event: { data: { starId: string; blockIndex: number; voice: string } }
    }) => {
      await this.handleFailure(context, GenerateTextBlockAudioJob.name)

      const repository = new SupabaseTextBlocksRepository(supabase)
      const job = new MarkTextBlockAudioAsErrorJob(repository)

      await job.handle({
        getPayload: () => context.event.data,
        run: async <Response = void>(callback: () => Promise<unknown>) =>
          (await callback()) as Response,
        waitFor: async () => {
          throw new Error('waitFor is not available in this context')
        },
        sleepFor: async () => {
          throw new Error('sleepFor is not available in this context')
        },
      })
    }
  }

  getFunctions(supabase: SupabaseClient<Database>) {
    return [
      this.createGenerateTextBlocksAudioBatchJob(),
      this.createCancelTextBlockAudioGenerationJob(supabase),
      this.createUpdateTextBlockAudioJob(supabase),
    ]
  }
}
