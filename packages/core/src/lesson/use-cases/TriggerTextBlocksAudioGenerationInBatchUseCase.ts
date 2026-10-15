import type { Database } from '#global/interfaces/Database'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { Id, Integer } from '#global/domain/structures/index'
import type { Broker, UseCase } from '#global/interfaces/index'
import { AudioVoice, TextBlockAudio, type TextBlock } from '../domain/structures'
import { TextBlocksAudioGenerationInBatchRequestedEvent } from '../domain/events'
import type { TextBlocksRepository } from '../interfaces'

type Request = {
  starId: string
}

type Response = Promise<TextBlockDto[]>
type PendingBlock = { textBlock: TextBlock; index: number; audio: TextBlockAudio }

export class TriggerTextBlocksAudioGenerationInBatchUseCase
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
    const blocksToGenerate = this.pendingBlocks(textBlocks)
    await this.persistPending(parsedStarId, blocksToGenerate)
    await this.publishGeneration(parsedStarId, blocksToGenerate)
    return this.pendingDtos(textBlocks, blocksToGenerate)
  }

  private pendingBlocks(textBlocks: TextBlock[]): PendingBlock[] {
    return textBlocks.flatMap((textBlock, index) => this.prepareBlock(textBlock, index))
  }

  private prepareBlock(textBlock: TextBlock, index: number): PendingBlock[] {
    if (!textBlock.canHaveAudio.value || textBlock.audio?.isPending) return []
    const audio = TextBlockAudio.createAsPending(
      textBlock.audio?.voice ?? AudioVoice.create(),
    )
    return [{ textBlock, index, audio }]
  }

  private async persistPending(starId: Id, blocks: PendingBlock[]) {
    await Promise.all(
      blocks.map((block) =>
        this.repository.updateAudio(
          starId,
          Integer.create(block.index, 'Indice do bloco'),
          block.audio,
        ),
      ),
    )
  }

  private publishGeneration(starId: Id, blocks: PendingBlock[]) {
    return this.broker.publish(
      new TextBlocksAudioGenerationInBatchRequestedEvent({
        starId: starId.value,
        blocks: blocks.map((block) => this.blockPayload(block)),
      }),
    )
  }

  private blockPayload(block: PendingBlock) {
    return {
      blockIndex: block.index,
      content: block.textBlock.content,
      voice: block.audio.voice.value,
      currentAudioFileName: block.textBlock.audio?.fileName.value || null,
    }
  }

  private pendingDtos(textBlocks: TextBlock[], blocks: PendingBlock[]) {
    return textBlocks.map((textBlock, index) => {
      const block = blocks.find((candidate) => candidate.index === index)
      return (block ? textBlock.setAudio(block.audio) : textBlock).dto
    })
  }
}
