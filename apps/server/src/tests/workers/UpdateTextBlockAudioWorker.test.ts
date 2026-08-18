import { randomUUID } from 'node:crypto'

import type { Context } from 'hono'

import { UpdateTextBlockAudioJob } from '@/queue/jobs/lesson'
import { TEXT_BLOCK_AUDIO_GENERATED_EVENT_NAME } from '@/queue/inngest/constants/lesson-event-names'
import { InngestFixture } from '../fixtures/InngestFixture'

const mockJobHandle = jest.fn().mockResolvedValue(undefined)

jest.mock('@/queue/jobs/lesson', () => {
  const actual = jest.requireActual('@/queue/jobs/lesson')
  const updateJob = Object.assign(
    jest.fn().mockImplementation(() => ({
      handle: mockJobHandle,
    })),
    { KEY: actual.UpdateTextBlockAudioJob.KEY },
  )

  return {
    ...actual,
    UpdateTextBlockAudioJob: updateJob,
  }
})

describe('UpdateTextBlockAudioWorker', () => {
  let inngest: InngestFixture

  beforeAll(async () => {
    delete process.env.INNGEST_SIGNING_KEY
    delete process.env.INNGEST_EVENT_KEY
    process.env.INNGEST_DEV = 'http://127.0.0.1:8288'

    const { Hono } = await import('hono')
    const { serve: serveInngest } = await import('inngest/hono')
    const { inngest: inngestClient } = await import('@/queue/inngest/inngest')
    const { LessonFunctions } = await import('@/queue/inngest/functions/LessonFunctions')
    const app = new Hono()
    app.on(['GET', 'PUT', 'POST'], '/inngest', (context) =>
      serveInngest({
        client: inngestClient,
        functions: new LessonFunctions(inngestClient).getFunctions({} as never),
      })(context as Context<any, any, Record<string, never>>),
    )

    inngest = new InngestFixture()
    await inngest.setup(app, [UpdateTextBlockAudioJob.KEY])
  })

  afterAll(async () => {
    await inngest.teardown()
  })

  beforeEach(() => {
    mockJobHandle.mockClear()
    jest.mocked(UpdateTextBlockAudioJob).mockClear()
  })

  it('executes the update audio job from an Inngest event', async () => {
    const response = await inngest.send({
      id: randomUUID(),
      name: TEXT_BLOCK_AUDIO_GENERATED_EVENT_NAME,
      data: {
        starId: '11111111-1111-4111-8111-111111111111',
        blockIndex: 0,
        voice: 'panda',
        fileName: 'generated.wav',
      },
    })

    expect(response.ids).toHaveLength(1)
    await inngest.waitFor(() => mockJobHandle.mock.calls.length === 1)

    expect(UpdateTextBlockAudioJob).toHaveBeenCalledWith(expect.anything())
    expect(mockJobHandle).toHaveBeenCalledWith(expect.anything())
  })
})
