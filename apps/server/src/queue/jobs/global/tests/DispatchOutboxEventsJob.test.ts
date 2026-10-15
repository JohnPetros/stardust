import { mock, type Mock } from 'ts-jest-mocker'
import type { Amqp, Broker, OutboxRepository } from '@stardust/core/global/interfaces'
import { Integer, Text } from '@stardust/core/global/structures'
import type { OutboxEvent } from '@stardust/core/global/types'

import { DispatchOutboxEventsJob } from '../DispatchOutboxEventsJob'

const event: OutboxEvent = {
  id: 'feedback:reply:stable-id',
  name: 'reporting/feedback.reply',
  payload: { messageId: 'message-id' },
  attempts: 0,
}

describe('DispatchOutboxEventsJob', () => {
  let repository: Mock<OutboxRepository>
  let publisher: Mock<Broker>
  let amqp: Mock<Amqp>
  let now: Date
  let job: DispatchOutboxEventsJob
  let onTerminalFailure: jest.Mock
  const owner = Text.create('worker-owner')

  beforeEach(() => {
    repository = mock<OutboxRepository>()
    publisher = mock<Broker>()
    amqp = mock<Amqp>()
    amqp.run.mockImplementation(async (operation) => operation())
    repository.recover.mockResolvedValue(undefined)
    publisher.publish.mockResolvedValue(undefined)
    repository.reserve.mockResolvedValue([event])
    repository.markPublished.mockResolvedValue(true)
    repository.markFailed.mockResolvedValue(true)
    repository.cleanup.mockResolvedValue(0)
    now = new Date('2026-10-15T12:00:00.000Z')
    onTerminalFailure = jest.fn()
    job = new DispatchOutboxEventsJob(
      repository,
      publisher,
      () => now,
      owner,
      onTerminalFailure,
    )
  })

  it('recovers durable work and sends the stored ID and payload before acknowledging its owner', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(expect.any(Function), 'Dispatch outbox events')
    expect(repository.recover).toHaveBeenCalledWith(now)
    expect(repository.reserve).toHaveBeenCalledWith(now, owner, Integer.create(100))
    expect(publisher.publish).toHaveBeenCalledWith(
      { name: event.name, payload: event.payload },
      Text.create(event.id),
    )
    expect(repository.markPublished).toHaveBeenCalledWith(
      Text.create(event.id),
      owner,
      now,
    )
    expect(repository.markFailed).not.toHaveBeenCalled()
    expect(repository.recover.mock.invocationCallOrder[0]).toBeLessThan(
      repository.reserve.mock.invocationCallOrder[0],
    )
    expect(publisher.publish.mock.invocationCallOrder[0]).toBeLessThan(
      repository.markPublished.mock.invocationCallOrder[0],
    )
  })

  it.each([
    [0, 1],
    [1, 5],
    [2, 15],
    [3, 60],
    [8, 60],
    [9, 60],
  ])(
    'records failed attempt %s with %s minutes backoff without acknowledging it',
    async (attempts, minutes) => {
      repository.reserve.mockResolvedValue([{ ...event, attempts }])
      publisher.publish.mockRejectedValue(new Error('provider error with private data'))

      await job.handle(amqp)

      expect(repository.markFailed).toHaveBeenCalledWith(
        Text.create(event.id),
        owner,
        Integer.create(attempts + 1),
        new Date(now.getTime() + minutes * 60_000),
        now,
      )
      expect(repository.markPublished).not.toHaveBeenCalled()
    },
  )

  it('continues draining other reserved events after a transport failure', async () => {
    repository.reserve.mockResolvedValue([event, { ...event, id: 'second-id' }])
    publisher.publish.mockRejectedValueOnce(new Error('unavailable'))

    await job.handle(amqp)

    expect(repository.markFailed).toHaveBeenCalledTimes(1)
    expect(repository.markPublished).toHaveBeenCalledWith(
      Text.create('second-id'),
      owner,
      now,
    )
  })

  it('does not overwrite a reservation that was recovered by another worker', async () => {
    repository.markPublished.mockResolvedValue(false)

    await expect(job.handle(amqp)).resolves.toBeUndefined()

    expect(repository.markPublished).toHaveBeenCalledWith(
      Text.create(event.id),
      owner,
      now,
    )
    expect(repository.markFailed).not.toHaveBeenCalled()
  })

  it('does not retry or acknowledge a failed send after its reservation owner changed', async () => {
    publisher.publish.mockRejectedValue(new Error('unavailable'))
    repository.markFailed.mockResolvedValue(false)

    await expect(job.handle(amqp)).resolves.toBeUndefined()

    expect(repository.markFailed).toHaveBeenCalledTimes(1)
    expect(repository.markPublished).not.toHaveBeenCalled()
    expect(publisher.publish).toHaveBeenCalledTimes(1)
  })

  it('propagates an acknowledgement database failure without treating it as a send failure', async () => {
    repository.markPublished.mockRejectedValue(new Error('database unavailable'))

    await expect(job.handle(amqp)).rejects.toThrow('database unavailable')

    expect(repository.markFailed).not.toHaveBeenCalled()
  })

  it('cleans only the repository published retention window at most once per day', async () => {
    repository.reserve.mockResolvedValue([])

    await job.handle(amqp)
    await job.handle(amqp)

    expect(repository.cleanup).toHaveBeenCalledTimes(1)
    expect(repository.cleanup).toHaveBeenCalledWith(new Date('2026-09-15T12:00:00.000Z'))
    now = new Date(now.getTime() + 86_400_000)
    await job.handle(amqp)
    expect(repository.cleanup).toHaveBeenCalledTimes(2)
    expect(repository.cleanup).toHaveBeenLastCalledWith(
      new Date('2026-09-16T12:00:00.000Z'),
    )
  })

  it('retries cleanup after a transient persistence failure', async () => {
    repository.reserve.mockResolvedValue([])
    repository.cleanup.mockRejectedValueOnce(new Error('database unavailable'))

    await expect(job.handle(amqp)).rejects.toThrow('database unavailable')
    await job.handle(amqp)

    expect(repository.cleanup).toHaveBeenCalledTimes(2)
  })

  it('signals exhausted deliveries using only the persisted ID and attempt count', async () => {
    repository.reserve.mockResolvedValue([{ ...event, attempts: 9 }])
    publisher.publish.mockRejectedValue(new Error('provider secret'))

    await job.handle(amqp)

    expect(onTerminalFailure).toHaveBeenCalledWith(event.id, 10)
    repository.markFailed.mockResolvedValue(false)
    await job.handle(amqp)
    expect(onTerminalFailure).toHaveBeenCalledTimes(1)
  })

  it('revisits recovery and reservation even when no prior work was available', async () => {
    repository.reserve.mockResolvedValueOnce([]).mockResolvedValueOnce([event])

    await job.handle(amqp)
    await job.handle(amqp)

    expect(repository.recover).toHaveBeenCalledTimes(2)
    expect(repository.reserve).toHaveBeenCalledTimes(2)
    expect(publisher.publish).toHaveBeenCalledTimes(1)
  })

  it('propagates recovery failure and does not attempt reservation or transport', async () => {
    repository.recover.mockRejectedValue(new Error('database unavailable'))

    await expect(job.handle(amqp)).rejects.toThrow('database unavailable')

    expect(repository.reserve).not.toHaveBeenCalled()
    expect(publisher.publish).not.toHaveBeenCalled()
  })
})
