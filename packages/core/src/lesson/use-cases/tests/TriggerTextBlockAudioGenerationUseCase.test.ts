import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker } from '#global/interfaces/index'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'
import { TextBlock } from '../../domain/structures'
import {
  TextBlockAudioGenerationNotPendingError,
  TextBlockAudioNotAllowedError,
  TextBlockNotFoundError,
} from '../../domain/errors'
import { TextBlockAudioGenerationRequestedEvent } from '../../domain/events'

import type { TextBlocksRepository } from '../../interfaces'
import { TriggerTextBlockAudioGenerationUseCase } from '../TriggerTextBlockAudioGenerationUseCase'

const makeTextBlock = (overrides: Partial<TextBlockDto> = {}) =>
  TextBlock.create({
    type: 'default',
    content: 'Texto do bloco',
    isRunnable: false,
    ...overrides,
  })

describe('Trigger TextBlock Audio Generation Use Case', () => {
  let repositoryMock: Mock<TextBlocksRepository>
  let brokerMock: Mock<Broker>
  let useCase: TriggerTextBlockAudioGenerationUseCase

  beforeEach(() => {
    repositoryMock = mock<TextBlocksRepository>()
    brokerMock = mock<Broker>()
    repositoryMock.findAllByStar.mockImplementation()
    repositoryMock.updateAudio.mockImplementation()
    brokerMock.publish.mockImplementation()
    useCase = new TriggerTextBlockAudioGenerationUseCase(repositoryMock, brokerMock)
  })

  it('should mark an eligible block as pending, persist audio and publish the request event', async () => {
    const starId = IdFaker.fake().value
    const textBlocks = [
      makeTextBlock({
        audio: {
          fileName: 'previous.wav',
          voice: 'princess',
          status: 'done',
        },
      }),
      makeTextBlock({ type: 'code', content: 'escreva("Oi")', isRunnable: true }),
    ]

    repositoryMock.findAllByStar.mockResolvedValue(textBlocks)

    const result = await useCase.execute({
      starId,
      blockIndex: 0,
      voice: 'shark',
    })

    expect(repositoryMock.updateAudio).toHaveBeenCalledWith(
      expect.objectContaining({ value: starId }),
      expect.objectContaining({ value: 0 }),
      expect.objectContaining({
        status: 'pending',
        voice: expect.objectContaining({ value: 'shark' }),
      }),
    )
    expect(brokerMock.publish).toHaveBeenCalledWith(
      expect.objectContaining<TextBlockAudioGenerationRequestedEvent>({
        name: TextBlockAudioGenerationRequestedEvent._NAME,
        payload: {
          starId,
          blockIndex: 0,
          content: 'Texto do bloco',
          voice: 'shark',
          currentAudioFileName: 'previous.wav',
        },
      }),
    )
    expect(result[0].audio).toEqual({
      fileName: '',
      voice: 'shark',
      status: 'pending',
    })
    expect(result[1].audio).toBeUndefined()
  })

  it('should throw when the target block does not exist', async () => {
    const starId = IdFaker.fake().value

    repositoryMock.findAllByStar.mockResolvedValue([makeTextBlock()])

    await expect(
      useCase.execute({
        starId,
        blockIndex: 1,
        voice: 'panda',
      }),
    ).rejects.toThrow(TextBlockNotFoundError)

    expect(repositoryMock.updateAudio).not.toHaveBeenCalled()
    expect(brokerMock.publish).not.toHaveBeenCalled()
  })

  it('should throw when the target block does not allow audio generation', async () => {
    const starId = IdFaker.fake().value

    repositoryMock.findAllByStar.mockResolvedValue([
      makeTextBlock({ type: 'code', content: 'escreva("Oi")', isRunnable: true }),
    ])

    await expect(
      useCase.execute({
        starId,
        blockIndex: 0,
        voice: 'panda',
      }),
    ).rejects.toThrow(TextBlockAudioNotAllowedError)

    expect(repositoryMock.updateAudio).not.toHaveBeenCalled()
    expect(brokerMock.publish).not.toHaveBeenCalled()
  })

  it('should throw when the target block audio is already pending', async () => {
    const starId = IdFaker.fake().value

    repositoryMock.findAllByStar.mockResolvedValue([
      makeTextBlock({
        audio: {
          fileName: '',
          voice: 'panda',
          status: 'pending',
        },
      }),
    ])

    await expect(
      useCase.execute({
        starId,
        blockIndex: 0,
        voice: 'shark',
      }),
    ).rejects.toThrow(TextBlockAudioGenerationNotPendingError)

    expect(repositoryMock.updateAudio).not.toHaveBeenCalled()
    expect(brokerMock.publish).not.toHaveBeenCalled()
  })
})
