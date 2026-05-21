import type { Broker, Amqp, Job } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import {
  TextBlockAudioGenerationRequestedEvent,
  TextBlocksAudioGenerationInBatchRequestedEvent,
} from '@stardust/core/lesson/events'

type Payload = EventPayload<typeof TextBlocksAudioGenerationInBatchRequestedEvent>

export class GenerateTextBlocksAudioBatchJob implements Job<Payload> {
  static readonly KEY = 'lesson/generate.text-blocks-audio-batch'

  constructor(private readonly broker: Broker) {}

  async handle(amqp: Amqp<Payload>): Promise<void> {
    const payload = amqp.getPayload()

    await amqp.run(async () => {
      for (const block of payload.blocks) {
        await this.broker.publish(
          new TextBlockAudioGenerationRequestedEvent({
            starId: payload.starId,
            blockIndex: block.blockIndex,
            content: block.content,
            voice: block.voice,
          }),
        )
      }
    }, GenerateTextBlocksAudioBatchJob.name)
  }
}
