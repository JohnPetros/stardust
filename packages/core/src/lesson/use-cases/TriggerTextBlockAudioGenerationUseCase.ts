import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/index'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { Id, Integer } from '#global/domain/structures/index'
import { AudioVoice, TextBlockAudio } from '../domain/structures'
import {
  TextBlockAudioNotAllowedError,
  TextBlockAudioGenerationNotPendingError,
  TextBlockNotFoundError,
} from '../domain/errors'
import { TextBlockAudioGenerationRequestedEvent } from '../domain/events'
import type { TextBlocksRepository } from '../interfaces'

type Request = {
  starId: string
  blockIndex: number
  voice: string
}

type Response = Promise<TextBlockDto[]>

export class TriggerTextBlockAudioGenerationUseCase
  implements UseCase<Request, Response>
{
  constructor(
    private readonly repository: TextBlocksRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ starId, blockIndex, voice }: Request): Response {
    const parsedStarId = Id.create(starId)
    const parsedBlockIndex = Integer.create(blockIndex, 'Indice do bloco')
    const textBlocks = await this.repository.findAllByStar(parsedStarId)
    const textBlock = textBlocks[parsedBlockIndex.value]

    if (!textBlock) throw new TextBlockNotFoundError()
    if (!textBlock.canHaveAudio.value) {
      throw new TextBlockAudioNotAllowedError(textBlock.type)
    }
    if (textBlock.audio?.isPending) {
      throw new TextBlockAudioGenerationNotPendingError(textBlock.audio.status)
    }

    const pendingAudio = TextBlockAudio.createAsPending(AudioVoice.create(voice))
    const updatedTextBlocks = textBlocks.map((currentTextBlock, index) =>
      index === parsedBlockIndex.value
        ? currentTextBlock.setAudio(pendingAudio)
        : currentTextBlock,
    )

    await this.repository.updateAudio(parsedStarId, parsedBlockIndex, pendingAudio)
    await this.broker.publish(
      new TextBlockAudioGenerationRequestedEvent({
        starId: parsedStarId.value,
        blockIndex: parsedBlockIndex.value,
        content: textBlock.content,
        voice: pendingAudio.voice.value,
      }),
    )

    return updatedTextBlocks.map((currentTextBlock) => currentTextBlock.dto)
  }
}
