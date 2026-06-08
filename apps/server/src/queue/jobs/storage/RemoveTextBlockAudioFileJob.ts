import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import { Text } from '@stardust/core/global/structures'
import type { TextBlockAudioFileRemovedEvent } from '@stardust/core/lesson/events'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

type Payload = EventPayload<typeof TextBlockAudioFileRemovedEvent>

export class RemoveTextBlockAudioFileJob implements Job<Payload> {
  static readonly KEY = 'storage/remove.text-block-audio-file'

  constructor(private readonly storageProvider: FileStorageProvider) {}

  async handle(amqp: Amqp<Payload>): Promise<void> {
    const payload = amqp.getPayload()
    const folder = FileStorageFolderPath.createAsAudiosStory()
    const fileName = Text.create(payload.fileName, 'Nome do arquivo de audio')

    const file = await amqp.run<File | null>(
      async () => await this.storageProvider.findFile(folder, fileName),
      'Find Text Block Audio File',
    )

    if (!file) return

    await amqp.run(
      async () => await this.storageProvider.removeFile(folder, fileName),
      'Remove Text Block Audio File',
    )
  }
}
