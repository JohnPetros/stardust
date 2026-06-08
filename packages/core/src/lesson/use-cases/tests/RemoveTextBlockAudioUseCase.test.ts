import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker } from '#global/interfaces/index'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'
import { Integer } from '#global/domain/structures/index'
import { TextBlock } from '../../domain/structures'
import {
  TextBlockAudioRemovalNotAllowedError,
  TextBlockNotFoundError,
} from '../../domain/errors'
import { TextBlockAudioFileRemovedEvent } from '../../domain/events'

import type { TextBlocksRepository } from '../../interfaces'
import { RemoveTextBlockAudioUseCase } from '../RemoveTextBlockAudioUseCase'

const makeTextBlock = (overrides: Partial<TextBlockDto> = {}) =>
  TextBlock.create({
    type: 'default',
    content: 'Texto do bloco',
    isRunnable: false,
    ...overrides,
  })

describe('Remove TextBlock Audio Use Case', () => {
  let repositoryMock: Mock<TextBlocksRepository>
  let brokerMock: Mock<Broker>
  let useCase: RemoveTextBlockAudioUseCase

  beforeEach(() => {
    repositoryMock = mock<TextBlocksRepository>()
    brokerMock = mock<Broker>()
    repositoryMock.findAllByStar.mockImplementation()
    repositoryMock.clearAudio.mockImplementation()
    brokerMock.publish.mockImplementation()
    useCase = new RemoveTextBlockAudioUseCase(repositoryMock, brokerMock)
  })

  it('should remove the block audio, persist the change and publish the file removal event', async () => {
    const starId = IdFaker.fake().value
    const textBlocks = [
      makeTextBlock({
        title: 'Titulo',
        picture: 'image.png',
        audio: {
          fileName: 'story-audio.wav',
          voice: 'panda',
          status: 'done',
        },
      }),
      makeTextBlock({ content: 'Outro bloco' }),
    ]

    repositoryMock.findAllByStar.mockResolvedValue(textBlocks)

    const result = await useCase.execute({ starId, blockIndex: 0 })

    expect(repositoryMock.clearAudio).toHaveBeenCalledWith(
      expect.objectContaining({ value: starId }),
      expect.any(Integer),
    )
    expect(repositoryMock.clearAudio).toHaveBeenCalledWith(
      expect.objectContaining({ value: starId }),
      expect.objectContaining({ value: 0 }),
    )
    expect(brokerMock.publish).toHaveBeenCalledWith(
      expect.objectContaining<TextBlockAudioFileRemovedEvent>({
        name: TextBlockAudioFileRemovedEvent._NAME,
        payload: { fileName: 'story-audio.wav' },
      }),
    )
    expect(result).toEqual([
      {
        type: 'default',
        content: 'Texto do bloco',
        title: 'Titulo',
        picture: 'image.png',
        isRunnable: false,
      },
      textBlocks[1].dto,
    ])
    expect(result[0]).not.toHaveProperty('audio')
  })

  it('should remove the block audio and skip the event when there is no file name', async () => {
    const starId = IdFaker.fake().value
    const textBlocks = [
      makeTextBlock({
        audio: {
          fileName: '',
          voice: 'panda',
          status: 'done',
        },
      }),
    ]

    repositoryMock.findAllByStar.mockResolvedValue(textBlocks)

    const result = await useCase.execute({ starId, blockIndex: 0 })

    expect(repositoryMock.clearAudio).toHaveBeenCalledWith(
      expect.objectContaining({ value: starId }),
      expect.objectContaining({ value: 0 }),
    )
    expect(brokerMock.publish).not.toHaveBeenCalled()
    expect(result).toEqual([
      {
        type: 'default',
        content: 'Texto do bloco',
        isRunnable: false,
      },
    ])
    expect(result[0]).not.toHaveProperty('audio')
  })

  it('should throw when the target block does not exist', async () => {
    const starId = IdFaker.fake().value

    repositoryMock.findAllByStar.mockResolvedValue([])

    await expect(useCase.execute({ starId, blockIndex: 0 })).rejects.toThrow(
      TextBlockNotFoundError,
    )

    expect(repositoryMock.clearAudio).not.toHaveBeenCalled()
    expect(brokerMock.publish).not.toHaveBeenCalled()
  })

  it('should throw when the target block audio is pending', async () => {
    const starId = IdFaker.fake().value

    repositoryMock.findAllByStar.mockResolvedValue([
      makeTextBlock({
        audio: {
          fileName: 'story-audio.wav',
          voice: 'panda',
          status: 'pending',
        },
      }),
    ])

    await expect(useCase.execute({ starId, blockIndex: 0 })).rejects.toThrow(
      TextBlockAudioRemovalNotAllowedError,
    )

    expect(repositoryMock.clearAudio).not.toHaveBeenCalled()
    expect(brokerMock.publish).not.toHaveBeenCalled()
  })
})
