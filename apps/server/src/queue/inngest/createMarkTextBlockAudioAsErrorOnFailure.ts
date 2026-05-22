import type { SupabaseClient } from '@supabase/supabase-js'
import type { FailureEventArgs } from 'inngest'

import type { EventPayload } from '@stardust/core/global/types'
import type { TextBlockAudioGenerationRequestedEvent } from '@stardust/core/lesson/events'

import { SupabaseTextBlocksRepository } from '@/database'
import type { Database } from '@/database/supabase/types/Database'
import { MarkTextBlockAudioAsErrorJob } from '@/queue/jobs/lesson'
import { GenerateTextBlockAudioJob } from '@/queue/jobs/storage'

import { NoStepAmqp } from './NoStepAmqp'
import { TEXT_BLOCK_AUDIO_GENERATION_REQUESTED_EVENT_NAME } from './constants/lesson-event-names'

type TextBlockAudioGenerationRequestedPayload = EventPayload<
  typeof TextBlockAudioGenerationRequestedEvent
>

type GenerateTextBlockAudioFailureContext = FailureEventArgs<{
  name: typeof TEXT_BLOCK_AUDIO_GENERATION_REQUESTED_EVENT_NAME
  data: TextBlockAudioGenerationRequestedPayload
}>

type HandleFailure = (context: { error: unknown }, jobName: string) => Promise<void>

export const createMarkTextBlockAudioAsErrorOnFailure = (
  supabase: SupabaseClient<Database>,
  handleFailure: HandleFailure,
) => {
  return async (context: GenerateTextBlockAudioFailureContext) => {
    await handleFailure(context, GenerateTextBlockAudioJob.name)

    const repository = new SupabaseTextBlocksRepository(supabase)
    const job = new MarkTextBlockAudioAsErrorJob(repository)
    const amqp = new NoStepAmqp(context.event.data.event.data)

    await job.handle(amqp)
  }
}
