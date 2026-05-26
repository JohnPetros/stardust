import type { Amqp, Job } from '@stardust/core/global/interfaces'
import { Id, Integer } from '@stardust/core/global/structures'
import { AudioVoice, TextBlockAudio } from '@stardust/core/lesson/structures'
import { TextBlockNotFoundError } from '@stardust/core/lesson/errors'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'

type Payload = {
  starId: string
  blockIndex: number
  voice: string
}

export class MarkTextBlockAudioAsErrorJob implements Job<Payload> {
  static readonly KEY = 'lesson/mark.text-block-audio-as-error'

  constructor(private readonly repository: TextBlocksRepository) {}

  async handle(amqp: Amqp<Payload>): Promise<void> {
    const payload = amqp.getPayload()
    const textBlock = await amqp.run<
      Awaited<ReturnType<MarkTextBlockAudioAsErrorJob['findTextBlock']>>
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
          currentAudio.markAsError(),
        ),
      MarkTextBlockAudioAsErrorJob.name,
    )
  }

  private async findTextBlock(starId: string, blockIndex: number) {
    const textBlocks = await this.repository.findAllByStar(Id.create(starId))
    const textBlock = textBlocks[blockIndex]

    if (!textBlock) throw new TextBlockNotFoundError()

    return textBlock
  }
}
