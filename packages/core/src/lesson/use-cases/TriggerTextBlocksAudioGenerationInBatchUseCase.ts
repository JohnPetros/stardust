import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { Id, Integer } from '#global/domain/structures/index'
import type { Broker, UseCase } from '#global/interfaces/index'
import { AudioVoice, TextBlockAudio } from '../domain/structures'
import { TextBlocksAudioGenerationInBatchRequestedEvent } from '../domain/events'
import type { TextBlocksRepository } from '../interfaces'

type Request = {
  starId: string
}

type Response = Promise<TextBlockDto[]>

export class TriggerTextBlocksAudioGenerationInBatchUseCase
  implements UseCase<Request, Response>
{
  constructor(
    private readonly repository: TextBlocksRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ starId }: Request): Response {
    const parsedStarId = Id.create(starId)
    const textBlocks = await this.repository.findAllByStar(parsedStarId)
    const blocksToGenerate = textBlocks.flatMap((textBlock, index) => {
      if (!textBlock.canHaveAudio.value || textBlock.audio?.isPending) return []

      const audio = TextBlockAudio.createAsPending(
        textBlock.audio?.voice ?? AudioVoice.create(),
      )

      return [{ textBlock, index, audio }]
    })

    await Promise.all(
      blocksToGenerate.map(
        async (block) =>
          await this.repository.updateAudio(
            parsedStarId,
            Integer.create(block.index, 'Indice do bloco'),
            block.audio,
          ),
      ),
    )

    const updatedTextBlocks = textBlocks.map((textBlock, index) => {
      const block = blocksToGenerate.find((currentBlock) => currentBlock.index === index)
      return block ? textBlock.setAudio(block.audio) : textBlock
    })

    await this.broker.publish(
      new TextBlocksAudioGenerationInBatchRequestedEvent({
        starId: parsedStarId.value,
        blocks: blocksToGenerate.map((block) => ({
          blockIndex: block.index,
          content: block.textBlock.content,
          voice: block.audio.voice.value,
        })),
      }),
    )

    return updatedTextBlocks.map((textBlock) => textBlock.dto)
  }
}
