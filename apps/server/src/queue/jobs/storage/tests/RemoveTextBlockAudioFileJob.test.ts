import { mock, type Mock } from 'ts-jest-mocker'

import type { Amqp } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { TextBlockAudioFileRemovedEvent } from '@stardust/core/lesson/events'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'

import { RemoveTextBlockAudioFileJob } from '../RemoveTextBlockAudioFileJob'

type Payload = EventPayload<typeof TextBlockAudioFileRemovedEvent>

describe('Remove TextBlock Audio File Job', () => {
  let amqp: Mock<Amqp<Payload>>
  let storageProvider: Mock<FileStorageProvider>
  let job: RemoveTextBlockAudioFileJob

  beforeEach(() => {
    amqp = mock<Amqp<Payload>>()
    storageProvider = mock<FileStorageProvider>()
    job = new RemoveTextBlockAudioFileJob(storageProvider)

    amqp.run.mockImplementation(async (callback) => await callback())
    storageProvider.findFile.mockImplementation()
    storageProvider.removeFile.mockImplementation()
    amqp.getPayload.mockReturnValue({ fileName: 'audio.wav' })
  })

  it('should remove the file when it exists', async () => {
    const file = new File(['audio'], 'audio.wav', { type: 'audio/wav' })

    storageProvider.findFile.mockResolvedValue(file)

    await job.handle(amqp)

    expect(amqp.getPayload).toHaveBeenCalled()
    expect(amqp.run).toHaveBeenNthCalledWith(
      1,
      expect.any(Function),
      'Find Text Block Audio File',
    )
    expect(storageProvider.findFile).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'audios/story' }),
      expect.objectContaining({ value: 'audio.wav' }),
    )
    expect(amqp.run).toHaveBeenNthCalledWith(
      2,
      expect.any(Function),
      'Remove Text Block Audio File',
    )
    expect(storageProvider.removeFile).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'audios/story' }),
      expect.objectContaining({ value: 'audio.wav' }),
    )
  })

  it('should succeed without removing when the file does not exist', async () => {
    storageProvider.findFile.mockResolvedValue(null)

    await expect(job.handle(amqp)).resolves.toBeUndefined()

    expect(amqp.getPayload).toHaveBeenCalled()
    expect(amqp.run).toHaveBeenCalledTimes(1)
    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      'Find Text Block Audio File',
    )
    expect(storageProvider.findFile).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'audios/story' }),
      expect.objectContaining({ value: 'audio.wav' }),
    )
    expect(storageProvider.removeFile).not.toHaveBeenCalled()
  })
})
