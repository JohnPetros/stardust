import { mock, type Mock } from 'ts-jest-mocker'

import type { Amqp, Broker } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import {
  TextBlockAudioGeneratedEvent,
  type TextBlockAudioGenerationRequestedEvent,
} from '@stardust/core/lesson/events'
import { TextBlockNotFoundError } from '@stardust/core/lesson/errors'
import type { TextBlocksRepository, TtsProvider } from '@stardust/core/lesson/interfaces'
import { TextBlock } from '@stardust/core/lesson/structures'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'

import { GenerateTextBlockAudioJob } from '../GenerateTextBlockAudioJob'

type Payload = EventPayload<typeof TextBlockAudioGenerationRequestedEvent>
const starId = '11111111-1111-4111-8111-111111111111'

const makeTextBlock = (overrides: Partial<TextBlockDto> = {}) =>
  TextBlock.create({
    type: 'default',
    content: 'Texto do bloco',
    isRunnable: false,
    ...overrides,
  })

describe('Generate TextBlock Audio Job', () => {
  let amqp: Mock<Amqp<Payload>>
  let repository: Mock<TextBlocksRepository>
  let ttsProvider: Mock<TtsProvider>
  let storageProvider: Mock<FileStorageProvider>
  let broker: Mock<Broker>
  let job: GenerateTextBlockAudioJob

  beforeEach(() => {
    amqp = mock<Amqp<Payload>>()
    repository = mock<TextBlocksRepository>()
    ttsProvider = mock<TtsProvider>()
    storageProvider = mock<FileStorageProvider>()
    broker = mock<Broker>()
    job = new GenerateTextBlockAudioJob(repository, ttsProvider, storageProvider, broker)

    amqp.run.mockImplementation(async (callback) => await callback())
    repository.findAllByStar.mockImplementation()
    ttsProvider.generate.mockImplementation()
    storageProvider.upload.mockImplementation()
    storageProvider.removeFile.mockImplementation()
    broker.publish.mockImplementation()
    amqp.getPayload.mockReturnValue({
      starId,
      blockIndex: 1,
      content: 'Conteudo do bloco',
      voice: 'shark',
      currentAudioFileName: null,
    })
  })

  it('should generate audio, upload it, refetch state and publish generated event when not cancelled', async () => {
    const generatedFile = new File(['audio'], 'generated.wav', { type: 'audio/wav' })
    const uploadedFile = new File(['audio'], 'uploaded.wav', { type: 'audio/wav' })

    repository.findAllByStar
      .mockResolvedValueOnce([
        makeTextBlock(),
        makeTextBlock({
          audio: { fileName: '', voice: 'shark', status: 'pending' },
        }),
      ])
      .mockResolvedValueOnce([
        makeTextBlock(),
        makeTextBlock({
          audio: { fileName: '', voice: 'shark', status: 'pending' },
        }),
      ])
    ttsProvider.generate.mockResolvedValue(generatedFile)
    storageProvider.upload.mockResolvedValue(uploadedFile)

    await job.handle(amqp)

    expect(ttsProvider.generate).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'Conteudo do bloco' }),
      expect.objectContaining({ value: 'shark' }),
    )
    expect(storageProvider.upload).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'audios/story' }),
      generatedFile,
    )
    expect(storageProvider.removeFile).not.toHaveBeenCalled()
    expect(broker.publish).toHaveBeenCalledWith(
      expect.objectContaining<TextBlockAudioGeneratedEvent>({
        name: TextBlockAudioGeneratedEvent._NAME,
        payload: {
          starId,
          blockIndex: 1,
          voice: 'shark',
          fileName: 'uploaded.wav',
        },
      }),
    )
  })

  it('should stop before generating when the current audio is already cancelled', async () => {
    repository.findAllByStar.mockResolvedValue([
      makeTextBlock(),
      makeTextBlock({
        audio: { fileName: '', voice: 'shark', status: 'cancelled' },
      }),
    ])

    await job.handle(amqp)

    expect(ttsProvider.generate).not.toHaveBeenCalled()
    expect(storageProvider.upload).not.toHaveBeenCalled()
    expect(storageProvider.removeFile).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should not publish after refetch when the block becomes cancelled', async () => {
    const generatedFile = new File(['audio'], 'generated.wav', { type: 'audio/wav' })
    const uploadedFile = new File(['audio'], 'uploaded.wav', { type: 'audio/wav' })

    repository.findAllByStar
      .mockResolvedValueOnce([
        makeTextBlock(),
        makeTextBlock({
          audio: { fileName: '', voice: 'shark', status: 'pending' },
        }),
      ])
      .mockResolvedValueOnce([
        makeTextBlock(),
        makeTextBlock({
          audio: { fileName: '', voice: 'shark', status: 'cancelled' },
        }),
      ])
    ttsProvider.generate.mockResolvedValue(generatedFile)
    storageProvider.upload.mockResolvedValue(uploadedFile)

    await job.handle(amqp)

    expect(ttsProvider.generate).toHaveBeenCalled()
    expect(storageProvider.upload).toHaveBeenCalled()
    expect(storageProvider.removeFile).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should delete previous audio file when payload has currentAudioFileName', async () => {
    const generatedFile = new File(['audio'], 'generated.wav', { type: 'audio/wav' })
    const uploadedFile = new File(['audio'], 'uploaded.wav', { type: 'audio/wav' })

    amqp.getPayload.mockReturnValue({
      starId,
      blockIndex: 1,
      content: 'Conteudo do bloco',
      voice: 'shark',
      currentAudioFileName: 'previous.wav',
    })

    repository.findAllByStar
      .mockResolvedValueOnce([
        makeTextBlock(),
        makeTextBlock({
          audio: { fileName: '', voice: 'shark', status: 'pending' },
        }),
      ])
      .mockResolvedValueOnce([
        makeTextBlock(),
        makeTextBlock({
          audio: { fileName: '', voice: 'shark', status: 'pending' },
        }),
      ])
    ttsProvider.generate.mockResolvedValue(generatedFile)
    storageProvider.upload.mockResolvedValue(uploadedFile)

    await job.handle(amqp)

    expect(storageProvider.removeFile).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'audios/story' }),
      expect.objectContaining({ value: 'previous.wav' }),
    )
  })

  it('should throw when the target block does not exist', async () => {
    repository.findAllByStar.mockResolvedValue([makeTextBlock()])

    await expect(job.handle(amqp)).rejects.toThrow(TextBlockNotFoundError)

    expect(ttsProvider.generate).not.toHaveBeenCalled()
    expect(storageProvider.upload).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })
})
