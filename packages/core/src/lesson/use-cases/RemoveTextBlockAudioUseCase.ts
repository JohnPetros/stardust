import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { Id, Integer } from '#global/domain/structures/index'
import type { Broker, UseCase } from '#global/interfaces/index'
import {
  TextBlockAudioRemovalNotAllowedError,
  TextBlockNotFoundError,
} from '../domain/errors'
import { TextBlockAudioFileRemovedEvent } from '../domain/events'
import type { TextBlocksRepository } from '../interfaces'

type Request = {
  starId: string
  blockIndex: number
}

type Response = Promise<TextBlockDto[]>

export class RemoveTextBlockAudioUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: TextBlocksRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ starId, blockIndex }: Request): Response {
    const parsedStarId = Id.create(starId)
    const parsedBlockIndex = Integer.create(blockIndex, 'Indice do bloco')
    const textBlocks = await this.repository.findAllByStar(parsedStarId)
    const textBlock = textBlocks[parsedBlockIndex.value]

    if (!textBlock) throw new TextBlockNotFoundError()
    if (textBlock.audio?.isPending) {
      throw new TextBlockAudioRemovalNotAllowedError(textBlock.audio.status)
    }

    const updatedTextBlocks = textBlocks.map((currentTextBlock, index) =>
      index === parsedBlockIndex.value
        ? currentTextBlock.removeAudio()
        : currentTextBlock,
    )

    await this.repository.clearAudio(parsedStarId, parsedBlockIndex)

    if (textBlock.audio?.fileName.value) {
      await this.broker.publish(
        new TextBlockAudioFileRemovedEvent({
          fileName: textBlock.audio.fileName.value,
        }),
      )
    }

    return updatedTextBlocks.map((currentTextBlock) => currentTextBlock.dto)
  }
}
