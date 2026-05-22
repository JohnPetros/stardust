import { mock, type Mock } from 'ts-jest-mocker'

import type { Amqp } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import { TextBlockAudioGeneratedEvent } from '@stardust/core/lesson/events'
import { TextBlockNotFoundError } from '@stardust/core/lesson/errors'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import { TextBlock } from '@stardust/core/lesson/structures'

import { UpdateTextBlockAudioJob } from '../UpdateTextBlockAudioJob'

type Payload = EventPayload<typeof TextBlockAudioGeneratedEvent>
const starId = '11111111-1111-4111-8111-111111111111'

const makeTextBlock = (overrides: Partial<TextBlockDto> = {}) =>
  TextBlock.create({
    type: 'default',
    content: 'Texto do bloco',
    isRunnable: false,
    ...overrides,
  })

describe('Update TextBlock Audio Job', () => {
  let amqp: Mock<Amqp<Payload>>
  let repository: Mock<TextBlocksRepository>
  let job: UpdateTextBlockAudioJob

  beforeEach(() => {
    amqp = mock<Amqp<Payload>>()
    repository = mock<TextBlocksRepository>()
    job = new UpdateTextBlockAudioJob(repository)

    amqp.run.mockImplementation(async (callback) => await callback())
    repository.findAllByStar.mockImplementation()
    repository.updateAudio.mockImplementation()
    amqp.getPayload.mockReturnValue({
      starId,
      blockIndex: 1,
      voice: 'shark',
      fileName: 'generated.wav',
    })
  })

  it('should persist the done state when the block is not cancelled', async () => {
    repository.findAllByStar.mockResolvedValue([
      makeTextBlock(),
      makeTextBlock({
        audio: { fileName: '', voice: 'panda', status: 'pending' },
      }),
    ])

    await job.handle(amqp)

    expect(repository.updateAudio).toHaveBeenCalledWith(
      expect.objectContaining({ value: starId }),
      expect.objectContaining({ value: 1 }),
      expect.objectContaining({
        status: 'done',
        fileName: expect.objectContaining({ value: 'generated.wav' }),
        voice: expect.objectContaining({ value: 'panda' }),
      }),
    )
  })

  it('should not persist when the current audio is already cancelled', async () => {
    repository.findAllByStar.mockResolvedValue([
      makeTextBlock(),
      makeTextBlock({
        audio: { fileName: '', voice: 'panda', status: 'cancelled' },
      }),
    ])

    await job.handle(amqp)

    expect(repository.updateAudio).not.toHaveBeenCalled()
  })

  it('should throw when the target block does not exist', async () => {
    repository.findAllByStar.mockResolvedValue([makeTextBlock()])

    await expect(job.handle(amqp)).rejects.toThrow(TextBlockNotFoundError)

    expect(repository.updateAudio).not.toHaveBeenCalled()
  })
})
