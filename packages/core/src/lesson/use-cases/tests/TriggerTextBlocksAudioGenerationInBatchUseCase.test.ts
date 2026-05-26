import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker } from '#global/interfaces/index'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'
import { TextBlocksAudioGenerationInBatchRequestedEvent } from '../../domain/events'
import { TextBlock } from '../../domain/structures'

import type { TextBlocksRepository } from '../../interfaces'
import { TriggerTextBlocksAudioGenerationInBatchUseCase } from '../TriggerTextBlocksAudioGenerationInBatchUseCase'

const makeTextBlock = (overrides: Partial<TextBlockDto> = {}) =>
  TextBlock.create({
    type: 'default',
    content: 'Texto do bloco',
    isRunnable: false,
    ...overrides,
  })

describe('Trigger TextBlocks Audio Generation In Batch Use Case', () => {
  let repositoryMock: Mock<TextBlocksRepository>
  let brokerMock: Mock<Broker>
  let useCase: TriggerTextBlocksAudioGenerationInBatchUseCase

  beforeEach(() => {
    repositoryMock = mock<TextBlocksRepository>()
    brokerMock = mock<Broker>()
    repositoryMock.findAllByStar.mockImplementation()
    repositoryMock.updateAudio.mockImplementation()
    brokerMock.publish.mockImplementation()
    useCase = new TriggerTextBlocksAudioGenerationInBatchUseCase(
      repositoryMock,
      brokerMock,
    )
  })

  it('should mark only eligible non-pending blocks as pending and publish the batch event', async () => {
    const starId = IdFaker.fake().value
    const textBlocks = [
      makeTextBlock({ content: 'Default sem voz' }),
      makeTextBlock({
        type: 'alert',
        content: 'Alerta com voz salva',
        audio: {
          fileName: 'previous.wav',
          voice: 'princess',
          status: 'done',
        },
      }),
      makeTextBlock({
        type: 'quote',
        content: 'Citando algo',
        audio: {
          fileName: '',
          voice: 'shark',
          status: 'pending',
        },
      }),
      makeTextBlock({ type: 'code', content: 'escreva("Oi")', isRunnable: true }),
    ]

    repositoryMock.findAllByStar.mockResolvedValue(textBlocks)

    const result = await useCase.execute({ starId })

    expect(repositoryMock.updateAudio).toHaveBeenCalledTimes(2)
    expect(repositoryMock.updateAudio).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ value: starId }),
      expect.objectContaining({ value: 0 }),
      expect.objectContaining({
        status: 'pending',
        voice: expect.objectContaining({ value: 'panda' }),
      }),
    )
    expect(repositoryMock.updateAudio).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ value: starId }),
      expect.objectContaining({ value: 1 }),
      expect.objectContaining({
        status: 'pending',
        voice: expect.objectContaining({ value: 'princess' }),
      }),
    )
    expect(brokerMock.publish).toHaveBeenCalledWith(
      expect.objectContaining<TextBlocksAudioGenerationInBatchRequestedEvent>({
        name: TextBlocksAudioGenerationInBatchRequestedEvent._NAME,
        payload: {
          starId,
          blocks: [
            {
              blockIndex: 0,
              content: 'Default sem voz',
              voice: 'panda',
              currentAudioFileName: null,
            },
            {
              blockIndex: 1,
              content: 'Alerta com voz salva',
              voice: 'princess',
              currentAudioFileName: 'previous.wav',
            },
          ],
        },
      }),
    )
    expect(result[0].audio).toEqual({ fileName: '', voice: 'panda', status: 'pending' })
    expect(result[1].audio).toEqual({
      fileName: '',
      voice: 'princess',
      status: 'pending',
    })
    expect(result[2].audio).toEqual({ fileName: '', voice: 'shark', status: 'pending' })
    expect(result[3].audio).toBeUndefined()
  })
})
