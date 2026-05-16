import { mock, type Mock } from 'ts-jest-mocker'

import type { Amqp } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import { TextBlockAudioGenerationCancelledEvent } from '@stardust/core/lesson/events'
import { TextBlockNotFoundError } from '@stardust/core/lesson/errors'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import { TextBlock } from '@stardust/core/lesson/structures'

import { CancelTextBlockAudioGenerationJob } from '../CancelTextBlockAudioGenerationJob'

type Payload = EventPayload<typeof TextBlockAudioGenerationCancelledEvent>
const starId = '11111111-1111-4111-8111-111111111111'

const makeTextBlock = (overrides: Partial<TextBlockDto> = {}) =>
  TextBlock.create({
    type: 'default',
    content: 'Texto do bloco',
    isRunnable: false,
    ...overrides,
  })

describe('Cancel TextBlock Audio Generation Job', () => {
  let amqp: Mock<Amqp<Payload>>
  let repository: Mock<TextBlocksRepository>
  let job: CancelTextBlockAudioGenerationJob

  beforeEach(() => {
    amqp = mock<Amqp<Payload>>()
    repository = mock<TextBlocksRepository>()
    job = new CancelTextBlockAudioGenerationJob(repository)

    amqp.run.mockImplementation(async (callback) => await callback())
    repository.findAllByStar.mockImplementation()
    repository.updateAudio.mockImplementation()
    amqp.getPayload.mockReturnValue({ starId, blockIndex: 0 })
  })

  it('should persist cancelled state only when the current audio is pending', async () => {
    repository.findAllByStar.mockResolvedValue([
      makeTextBlock({
        audio: { fileName: '', voice: 'panda', status: 'pending' },
      }),
    ])

    await job.handle(amqp)

    expect(repository.updateAudio).toHaveBeenCalledWith(
      expect.objectContaining({ value: starId }),
      expect.objectContaining({ value: 0 }),
      expect.objectContaining({
        status: 'cancelled',
        voice: expect.objectContaining({ value: 'panda' }),
      }),
    )
  })

  it('should not persist when the current audio is not pending', async () => {
    repository.findAllByStar.mockResolvedValue([
      makeTextBlock({
        audio: { fileName: 'done.wav', voice: 'panda', status: 'done' },
      }),
    ])

    await job.handle(amqp)

    expect(repository.updateAudio).not.toHaveBeenCalled()
  })

  it('should throw when the target block does not exist', async () => {
    repository.findAllByStar.mockResolvedValue([])

    await expect(job.handle(amqp)).rejects.toThrow(TextBlockNotFoundError)

    expect(repository.updateAudio).not.toHaveBeenCalled()
  })
})
