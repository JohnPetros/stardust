import type { Database } from '#global/interfaces/Database'
import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/index'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { Id, Integer } from '#global/domain/structures/index'
import { AudioVoice, TextBlockAudio, type TextBlock } from '../domain/structures'
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
type GenerationTarget = {
  starId: Id
  blockIndex: Integer
  blocks: TextBlock[]
  block: TextBlock
}

export class TriggerTextBlockAudioGenerationUseCase
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

  private async executeInTransaction(request: Request): Response {
    const target = await this.loadTarget(request)
    const audio = await this.persistGeneration(target, request.voice)
    return this.pendingDtos(target.blocks, target.blockIndex, audio)
  }

  private async loadTarget(request: Request): Promise<GenerationTarget> {
    const target = await this.loadBlocks(request)
    return { ...target, block: this.findEligible(target.blocks, target.blockIndex) }
  }

  private findEligible(blocks: TextBlock[], index: Integer) {
    const textBlock = blocks[index.value]
    if (!textBlock) throw new TextBlockNotFoundError()
    this.validateEligible(textBlock)
    return textBlock
  }

  private validateEligible(textBlock: TextBlock) {
    if (!textBlock.canHaveAudio.value)
      throw new TextBlockAudioNotAllowedError(textBlock.type)
    if (textBlock.audio?.isPending) {
      throw new TextBlockAudioGenerationNotPendingError(textBlock.audio.status)
    }
  }

  private publishGeneration(
    starId: Id,
    blockIndex: Integer,
    block: TextBlock,
    audio: TextBlockAudio,
  ) {
    return this.broker.publish(
      new TextBlockAudioGenerationRequestedEvent({
        starId: starId.value,
        blockIndex: blockIndex.value,
        ...this.audioPayload(block, audio),
      }),
    )
  }

  private audioPayload(block: TextBlock, audio: TextBlockAudio) {
    return {
      content: block.content,
      voice: audio.voice.value,
      currentAudioFileName: block.audio?.fileName.value || null,
    }
  }

  private pendingDtos(blocks: TextBlock[], blockIndex: Integer, audio: TextBlockAudio) {
    return blocks.map(
      (textBlock, index) =>
        (index === blockIndex.value ? textBlock.setAudio(audio) : textBlock).dto,
    )
  }
  private async loadBlocks(request: Request) {
    const starId = Id.create(request.starId)
    const blockIndex = Integer.create(request.blockIndex, 'Indice do bloco')
    const blocks = await this.repository.findAllByStar(starId)
    return { starId, blockIndex, blocks }
  }
  private async persistGeneration(target: GenerationTarget, voice: string) {
    const audio = TextBlockAudio.createAsPending(AudioVoice.create(voice))
    await this.repository.updateAudio(target.starId, target.blockIndex, audio)
    await this.publishGeneration(target.starId, target.blockIndex, target.block, audio)
    return audio
  }
}
