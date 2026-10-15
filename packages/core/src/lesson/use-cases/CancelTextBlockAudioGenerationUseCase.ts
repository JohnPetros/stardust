import type { Database } from '#global/interfaces/Database'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { Id, Integer } from '#global/domain/structures/index'
import type { Broker, UseCase } from '#global/interfaces/index'
import {
  TextBlockAudioGenerationNotPendingError,
  TextBlockNotFoundError,
} from '../domain/errors'
import { TextBlockAudioGenerationCancelledEvent } from '../domain/events'
import type { TextBlock } from '../domain/structures'
import type { TextBlocksRepository } from '../interfaces'

type Request = {
  starId: string
  blockIndex: number
}

type Response = Promise<TextBlockDto[]>

export class CancelTextBlockAudioGenerationUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly database: Database,
    private readonly repository: TextBlocksRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request): Response {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction(request: Request): Response {
    const { starId, blockIndex, blocks } = await this.loadBlocks(request)
    this.validatePending(blocks[blockIndex.value])
    await this.publishCancellation(starId, blockIndex)

    return blocks.map((currentTextBlock) => currentTextBlock.dto)
  }
  private validatePending(textBlock: TextBlock | undefined) {
    if (!textBlock) throw new TextBlockNotFoundError()
    if (!textBlock.audio?.isPending) {
      throw new TextBlockAudioGenerationNotPendingError(textBlock.audio?.status ?? 'idle')
    }
  }

  private publishCancellation(starId: Id, blockIndex: Integer) {
    return this.broker.publish(
      new TextBlockAudioGenerationCancelledEvent({
        starId: starId.value,
        blockIndex: blockIndex.value,
      }),
    )
  }
  private async loadBlocks(request: Request) {
    const starId = Id.create(request.starId)
    const blockIndex = Integer.create(request.blockIndex, 'Indice do bloco')
    const blocks = await this.repository.findAllByStar(starId)
    return { starId, blockIndex, blocks }
  }
}
