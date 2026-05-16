import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker } from '#global/interfaces/index'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'
import { TextBlockAudioGenerationCancelledEvent } from '../../domain/events'
import { TextBlock } from '../../domain/structures'

import type { TextBlocksRepository } from '../../interfaces'
import { CancelTextBlocksAudioGenerationInBatchUseCase } from '../CancelTextBlocksAudioGenerationInBatchUseCase'

const makeTextBlock = (overrides: Partial<TextBlockDto> = {}) =>
  TextBlock.create({
    type: 'default',
    content: 'Texto do bloco',
    isRunnable: false,
    ...overrides,
  })

describe('Cancel TextBlocks Audio Generation In Batch Use Case', () => {
  let repositoryMock: Mock<TextBlocksRepository>
  let brokerMock: Mock<Broker>
  let useCase: CancelTextBlocksAudioGenerationInBatchUseCase

  beforeEach(() => {
    repositoryMock = mock<TextBlocksRepository>()
    brokerMock = mock<Broker>()
    repositoryMock.findAllByStar.mockImplementation()
    brokerMock.publish.mockImplementation()
    useCase = new CancelTextBlocksAudioGenerationInBatchUseCase(
      repositoryMock,
      brokerMock,
    )
  })

  it('should publish one cancellation event per pending block and ignore others', async () => {
    const starId = IdFaker.fake().value
    const textBlocks = [
      makeTextBlock({
        content: 'Pendente 1',
        audio: { fileName: '', voice: 'panda', status: 'pending' },
      }),
      makeTextBlock({
        content: 'Concluido',
        audio: { fileName: 'done.wav', voice: 'shark', status: 'done' },
      }),
      makeTextBlock({ content: 'Sem audio' }),
      makeTextBlock({
        content: 'Pendente 2',
        audio: { fileName: '', voice: 'princess', status: 'pending' },
      }),
    ]

    repositoryMock.findAllByStar.mockResolvedValue(textBlocks)

    const result = await useCase.execute({ starId })

    expect(brokerMock.publish).toHaveBeenCalledTimes(2)
    expect(brokerMock.publish).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining<TextBlockAudioGenerationCancelledEvent>({
        name: TextBlockAudioGenerationCancelledEvent._NAME,
        payload: { starId, blockIndex: 0 },
      }),
    )
    expect(brokerMock.publish).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining<TextBlockAudioGenerationCancelledEvent>({
        name: TextBlockAudioGenerationCancelledEvent._NAME,
        payload: { starId, blockIndex: 3 },
      }),
    )
    expect(result).toEqual(textBlocks.map((textBlock) => textBlock.dto))
  })
})
