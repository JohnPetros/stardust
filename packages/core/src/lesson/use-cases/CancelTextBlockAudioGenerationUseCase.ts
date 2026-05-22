import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { Id, Integer } from '#global/domain/structures/index'
import type { Broker, UseCase } from '#global/interfaces/index'
import {
  TextBlockAudioGenerationNotPendingError,
  TextBlockNotFoundError,
} from '../domain/errors'
import { TextBlockAudioGenerationCancelledEvent } from '../domain/events'
import type { TextBlocksRepository } from '../interfaces'

type Request = {
  starId: string
  blockIndex: number
}

type Response = Promise<TextBlockDto[]>

export class CancelTextBlockAudioGenerationUseCase implements UseCase<Request, Response> {
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
    if (!textBlock.audio?.isPending) {
      throw new TextBlockAudioGenerationNotPendingError(textBlock.audio?.status ?? 'idle')
    }

    await this.broker.publish(
      new TextBlockAudioGenerationCancelledEvent({
        starId: parsedStarId.value,
        blockIndex: parsedBlockIndex.value,
      }),
    )

    return textBlocks.map((currentTextBlock) => currentTextBlock.dto)
  }
}
