import type { Database } from '#global/interfaces/Database'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { Id, Integer } from '#global/domain/structures/index'
import type { Broker, UseCase } from '#global/interfaces/index'
import {
  TextBlockAudioRemovalNotAllowedError,
  TextBlockNotFoundError,
} from '../domain/errors'
import { TextBlockAudioFileRemovedEvent } from '../domain/events'
import type { TextBlock } from '../domain/structures'
import type { TextBlocksRepository } from '../interfaces'

type Request = {
  starId: string
  blockIndex: number
}

type Response = Promise<TextBlockDto[]>

export class RemoveTextBlockAudioUseCase implements UseCase<Request, Response> {
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
    const textBlock = this.findRemovable(blocks, blockIndex)
    await this.repository.clearAudio(starId, blockIndex)
    await this.publishRemoval(textBlock)
    return this.removedDtos(blocks, blockIndex)
  }

  private findRemovable(blocks: TextBlock[], index: Integer) {
    const textBlock = blocks[index.value]
    if (!textBlock) throw new TextBlockNotFoundError()
    if (textBlock.audio?.isPending) {
      throw new TextBlockAudioRemovalNotAllowedError(textBlock.audio.status)
    }
    return textBlock
  }

  private async publishRemoval(textBlock: TextBlock) {
    const fileName = textBlock.audio?.fileName.value
    if (fileName)
      await this.broker.publish(new TextBlockAudioFileRemovedEvent({ fileName }))
  }

  private removedDtos(blocks: TextBlock[], blockIndex: Integer) {
    return blocks.map(
      (textBlock, index) =>
        (index === blockIndex.value ? textBlock.removeAudio() : textBlock).dto,
    )
  }
  private async loadBlocks(request: Request) {
    const starId = Id.create(request.starId)
    const blockIndex = Integer.create(request.blockIndex, 'Indice do bloco')
    const blocks = await this.repository.findAllByStar(starId)
    return { starId, blockIndex, blocks }
  }
}
