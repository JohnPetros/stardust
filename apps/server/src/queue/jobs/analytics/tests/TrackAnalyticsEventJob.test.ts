import { mock, type Mock } from 'ts-jest-mocker'

import type { AnalyticsEventDto } from '@stardust/core/analytics/entities/dtos'
import type { ServerAnalyticsProvider } from '@stardust/core/analytics/interfaces'
import { AnalyticsEvent } from '@stardust/core/analytics/structures'
import type { Amqp } from '@stardust/core/global/interfaces'

import { TrackAnalyticsEventJob } from '../TrackAnalyticsEventJob'

describe('Track Analytics Event Job', () => {
  let amqp: Mock<Amqp>
  let analyticsProvider: Mock<ServerAnalyticsProvider>
  let analyticsEventDto: AnalyticsEventDto
  let job: TrackAnalyticsEventJob

  beforeEach(() => {
    amqp = mock<Amqp>()
    analyticsProvider = mock<ServerAnalyticsProvider>()
    analyticsEventDto = {
      name: 'profile/user.rewarded',
      distinctId: '11111111-1111-4111-8111-111111111111',
      insertId: 'event-id',
      properties: { xp: 100 },
    }
    job = new TrackAnalyticsEventJob(analyticsProvider, analyticsEventDto)

    amqp.run.mockImplementation(async (callback) => await callback())
    analyticsProvider.trackEvent.mockImplementation()
  })

  it('should track the analytics event inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      TrackAnalyticsEventJob.name,
    )
    expect(analyticsProvider.trackEvent).toHaveBeenCalledWith(expect.any(AnalyticsEvent))
  })

  it('should track the normalized dto as an AnalyticsEvent', async () => {
    await job.handle(amqp)

    const event = analyticsProvider.trackEvent.mock.calls[0][0]
    expect(event).toBeInstanceOf(AnalyticsEvent)
    expect(event.dto).toEqual(analyticsEventDto)
  })

  it('should propagate provider failures', async () => {
    const error = new Error('PostHog failed')
    analyticsProvider.trackEvent.mockRejectedValue(error)

    await expect(job.handle(amqp)).rejects.toThrow(error)
  })
})
