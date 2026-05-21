import type { Amqp, Broker, Job } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import { Id, Text } from '@stardust/core/global/structures'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'
import { AudioVoice } from '@stardust/core/lesson/structures'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import type { TtsProvider, TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import {
  TextBlockAudioGeneratedEvent,
  type TextBlockAudioGenerationRequestedEvent,
} from '@stardust/core/lesson/events'
import { TextBlockNotFoundError } from '@stardust/core/lesson/errors'

type Payload = EventPayload<typeof TextBlockAudioGenerationRequestedEvent>

export class GenerateTextBlockAudioJob implements Job<Payload> {
  static readonly KEY = 'storage/generate.text-block-audio'

  constructor(
    private readonly repository: TextBlocksRepository,
    private readonly ttsProvider: TtsProvider,
    private readonly storageProvider: FileStorageProvider,
    private readonly broker: Broker,
  ) {}

  async handle(amqp: Amqp<Payload>): Promise<void> {
    const payload = amqp.getPayload()
    const textBlock = await amqp.run<
      Awaited<ReturnType<GenerateTextBlockAudioJob['findTextBlock']>>
    >(
      async () => await this.findTextBlock(payload.starId, payload.blockIndex),
      'Find Text Block',
    )

    if (textBlock.audio?.isCancelled) return

    const generatedFile = await amqp.run<File>(
      async () =>
        await this.ttsProvider.generate(
          Text.create(payload.content, 'Conteudo do bloco'),
          AudioVoice.create(payload.voice),
        ),
      'Generate Text Block Audio',
    )

    const uploadedFile = await amqp.run<File>(
      async () =>
        await this.storageProvider.upload(
          FileStorageFolderPath.createAsAudiosStory(),
          generatedFile,
        ),
      'Upload Text Block Audio',
    )

    const updatedTextBlock = await amqp.run<
      Awaited<ReturnType<GenerateTextBlockAudioJob['findTextBlock']>>
    >(
      async () => await this.findTextBlock(payload.starId, payload.blockIndex),
      'Refetch Text Block',
    )

    if (updatedTextBlock.audio?.isCancelled) return

    await amqp.run(
      async () =>
        await this.broker.publish(
          new TextBlockAudioGeneratedEvent({
            starId: payload.starId,
            blockIndex: payload.blockIndex,
            voice: payload.voice,
            fileName: uploadedFile.name,
          }),
        ),
      GenerateTextBlockAudioJob.name,
    )
  }

  private async findTextBlock(starId: string, blockIndex: number) {
    const textBlocks = await this.repository.findAllByStar(Id.create(starId))
    const textBlock = textBlocks[blockIndex]

    if (!textBlock) throw new TextBlockNotFoundError()

    return textBlock
  }
}
