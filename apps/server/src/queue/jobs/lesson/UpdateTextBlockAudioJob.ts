import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import { Id, Integer } from '@stardust/core/global/structures'
import { AudioVoice, TextBlockAudio } from '@stardust/core/lesson/structures'
import { TextBlockNotFoundError } from '@stardust/core/lesson/errors'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import type { TextBlockAudioGeneratedEvent } from '@stardust/core/lesson/events'

type Payload = EventPayload<typeof TextBlockAudioGeneratedEvent>

export class UpdateTextBlockAudioJob implements Job<Payload> {
  static readonly KEY = 'lesson/update.text-block-audio'

  constructor(private readonly repository: TextBlocksRepository) {}

  async handle(amqp: Amqp<Payload>): Promise<void> {
    const payload = amqp.getPayload()
    const textBlock = await amqp.run<
      Awaited<ReturnType<UpdateTextBlockAudioJob['findTextBlock']>>
    >(
      async () => await this.findTextBlock(payload.starId, payload.blockIndex),
      'Find Text Block',
    )

    if (textBlock.audio?.isCancelled) return

    const currentAudio = textBlock.audio
      ? textBlock.audio
      : TextBlockAudio.createAsPending(AudioVoice.create(payload.voice))

    await amqp.run(
      async () =>
        await this.repository.updateAudio(
          Id.create(payload.starId),
          Integer.create(payload.blockIndex, 'Indice do bloco'),
          currentAudio.markAsDone(payload.fileName),
        ),
      UpdateTextBlockAudioJob.name,
    )
  }

  private async findTextBlock(starId: string, blockIndex: number) {
    const textBlocks = await this.repository.findAllByStar(Id.create(starId))
    const textBlock = textBlocks[blockIndex]

    if (!textBlock) throw new TextBlockNotFoundError()

    return textBlock
  }
}
