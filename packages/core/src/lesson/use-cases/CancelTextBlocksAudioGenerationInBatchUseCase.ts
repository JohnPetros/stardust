import type { Database } from '#global/interfaces/Database'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { Id } from '#global/domain/structures/index'
import type { Broker, UseCase } from '#global/interfaces/index'
import { TextBlockAudioGenerationCancelledEvent } from '../domain/events'
import type { TextBlock } from '../domain/structures'
import type { TextBlocksRepository } from '../interfaces'

type Request = {
  starId: string
}

type Response = Promise<TextBlockDto[]>

export class CancelTextBlocksAudioGenerationInBatchUseCase
  implements UseCase<Request, Response>
{
  constructor(
    private readonly database: Database,
    private readonly repository: TextBlocksRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request): Response {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction({ starId }: Request): Response {
    const parsedStarId = Id.create(starId)
    const textBlocks = await this.repository.findAllByStar(parsedStarId)

    await this.cancelPending(parsedStarId, textBlocks)
    return textBlocks.map((textBlock) => textBlock.dto)
  }
  private async cancelPending(starId: Id, textBlocks: TextBlock[]) {
    for (const [index, textBlock] of textBlocks.entries()) {
      if (textBlock.audio?.isPending) await this.publishCancellation(starId, index)
    }
  }

  private publishCancellation(starId: Id, blockIndex: number) {
    return this.broker.publish(
      new TextBlockAudioGenerationCancelledEvent({
        starId: starId.value,
        blockIndex,
      }),
    )
  }
}
