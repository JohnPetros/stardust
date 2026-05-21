import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import { Id, Integer } from '@stardust/core/global/structures'
import { TextBlockNotFoundError } from '@stardust/core/lesson/errors'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import type { TextBlockAudioGenerationCancelledEvent } from '@stardust/core/lesson/events'

type Payload = EventPayload<typeof TextBlockAudioGenerationCancelledEvent>

export class CancelTextBlockAudioGenerationJob implements Job<Payload> {
  static readonly KEY = 'lesson/cancel.text-block-audio-generation'

  constructor(private readonly repository: TextBlocksRepository) {}

  async handle(amqp: Amqp<Payload>): Promise<void> {
    const payload = amqp.getPayload()
    const textBlock = await amqp.run<
      Awaited<ReturnType<CancelTextBlockAudioGenerationJob['findTextBlock']>>
    >(
      async () => await this.findTextBlock(payload.starId, payload.blockIndex),
      'Find Text Block',
    )

    if (!textBlock.audio?.isPending) return

    const audio = textBlock.audio

    await amqp.run(
      async () =>
        await this.repository.updateAudio(
          Id.create(payload.starId),
          Integer.create(payload.blockIndex, 'Indice do bloco'),
          audio.markAsCancelled(),
        ),
      CancelTextBlockAudioGenerationJob.name,
    )
  }

  private async findTextBlock(starId: string, blockIndex: number) {
    const textBlocks = await this.repository.findAllByStar(Id.create(starId))
    const textBlock = textBlocks[blockIndex]

    if (!textBlock) throw new TextBlockNotFoundError()

    return textBlock
  }
}
