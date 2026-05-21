import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { Id } from '#global/domain/structures/index'
import type { Broker, UseCase } from '#global/interfaces/index'
import { TextBlockAudioGenerationCancelledEvent } from '../domain/events'
import type { TextBlocksRepository } from '../interfaces'

type Request = {
  starId: string
}

type Response = Promise<TextBlockDto[]>

export class CancelTextBlocksAudioGenerationInBatchUseCase
  implements UseCase<Request, Response>
{
  constructor(
    private readonly repository: TextBlocksRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ starId }: Request): Response {
    const parsedStarId = Id.create(starId)
    const textBlocks = await this.repository.findAllByStar(parsedStarId)

    for (const [index, textBlock] of textBlocks.entries()) {
      if (!textBlock.audio?.isPending) continue

      await this.broker.publish(
        new TextBlockAudioGenerationCancelledEvent({
          starId: parsedStarId.value,
          blockIndex: index,
        }),
      )
    }

    return textBlocks.map((textBlock) => textBlock.dto)
  }
}
