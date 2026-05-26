import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker } from '#global/interfaces/index'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'
import { TextBlock } from '../../domain/structures'
import {
  TextBlockAudioGenerationNotPendingError,
  TextBlockNotFoundError,
} from '../../domain/errors'
import { TextBlockAudioGenerationCancelledEvent } from '../../domain/events'

import type { TextBlocksRepository } from '../../interfaces'
import { CancelTextBlockAudioGenerationUseCase } from '../CancelTextBlockAudioGenerationUseCase'

const makeTextBlock = (overrides: Partial<TextBlockDto> = {}) =>
  TextBlock.create({
    type: 'default',
    content: 'Texto do bloco',
    isRunnable: false,
    ...overrides,
  })

describe('Cancel TextBlock Audio Generation Use Case', () => {
  let repositoryMock: Mock<TextBlocksRepository>
  let brokerMock: Mock<Broker>
  let useCase: CancelTextBlockAudioGenerationUseCase

  beforeEach(() => {
    repositoryMock = mock<TextBlocksRepository>()
    brokerMock = mock<Broker>()
    repositoryMock.findAllByStar.mockImplementation()
    brokerMock.publish.mockImplementation()
    useCase = new CancelTextBlockAudioGenerationUseCase(repositoryMock, brokerMock)
  })

  it('should publish cancellation for a pending block and return the current blocks', async () => {
    const starId = IdFaker.fake().value
    const textBlocks = [
      makeTextBlock({
        audio: {
          fileName: '',
          voice: 'panda',
          status: 'pending',
        },
      }),
    ]

    repositoryMock.findAllByStar.mockResolvedValue(textBlocks)

    const result = await useCase.execute({ starId, blockIndex: 0 })

    expect(brokerMock.publish).toHaveBeenCalledWith(
      expect.objectContaining<TextBlockAudioGenerationCancelledEvent>({
        name: TextBlockAudioGenerationCancelledEvent._NAME,
        payload: { starId, blockIndex: 0 },
      }),
    )
    expect(result).toEqual(textBlocks.map((textBlock) => textBlock.dto))
  })

  it('should throw when the target block does not exist', async () => {
    const starId = IdFaker.fake().value

    repositoryMock.findAllByStar.mockResolvedValue([])

    await expect(useCase.execute({ starId, blockIndex: 0 })).rejects.toThrow(
      TextBlockNotFoundError,
    )

    expect(brokerMock.publish).not.toHaveBeenCalled()
  })

  it('should throw when the target block audio is not pending', async () => {
    const starId = IdFaker.fake().value

    repositoryMock.findAllByStar.mockResolvedValue([
      makeTextBlock({
        audio: {
          fileName: 'audio.wav',
          voice: 'panda',
          status: 'done',
        },
      }),
    ])

    await expect(useCase.execute({ starId, blockIndex: 0 })).rejects.toThrow(
      TextBlockAudioGenerationNotPendingError,
    )

    expect(brokerMock.publish).not.toHaveBeenCalled()
  })
})
