import { mock, type Mock } from 'ts-jest-mocker'

import type { Amqp, Broker } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import {
  TextBlockAudioGenerationRequestedEvent,
  TextBlocksAudioGenerationInBatchRequestedEvent,
} from '@stardust/core/lesson/events'

import { GenerateTextBlocksAudioBatchJob } from '../GenerateTextBlocksAudioBatchJob'

type Payload = EventPayload<typeof TextBlocksAudioGenerationInBatchRequestedEvent>

describe('Generate TextBlocks Audio Batch Job', () => {
  let amqp: Mock<Amqp<Payload>>
  let broker: Mock<Broker>
  let job: GenerateTextBlocksAudioBatchJob

  beforeEach(() => {
    amqp = mock<Amqp<Payload>>()
    broker = mock<Broker>()
    job = new GenerateTextBlocksAudioBatchJob(broker)

    amqp.run.mockImplementation(async (callback) => await callback())
    broker.publish.mockImplementation()
  })

  it('should fan out one generation request event per block', async () => {
    amqp.getPayload.mockReturnValue({
      starId: 'star-id',
      blocks: [
        {
          blockIndex: 0,
          content: 'Primeiro bloco',
          voice: 'panda',
          currentAudioFileName: null,
        },
        {
          blockIndex: 3,
          content: 'Segundo bloco',
          voice: 'shark',
          currentAudioFileName: 'old.wav',
        },
      ],
    })

    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      GenerateTextBlocksAudioBatchJob.name,
    )
    expect(broker.publish).toHaveBeenCalledTimes(2)
    expect(broker.publish).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining<TextBlockAudioGenerationRequestedEvent>({
        name: TextBlockAudioGenerationRequestedEvent._NAME,
        payload: {
          starId: 'star-id',
          blockIndex: 0,
          content: 'Primeiro bloco',
          voice: 'panda',
          currentAudioFileName: null,
        },
      }),
    )
    expect(broker.publish).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining<TextBlockAudioGenerationRequestedEvent>({
        name: TextBlockAudioGenerationRequestedEvent._NAME,
        payload: {
          starId: 'star-id',
          blockIndex: 3,
          content: 'Segundo bloco',
          voice: 'shark',
          currentAudioFileName: 'old.wav',
        },
      }),
    )
  })
})
