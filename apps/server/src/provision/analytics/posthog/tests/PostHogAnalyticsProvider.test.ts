const mockCapture = jest.fn()
const mockFlush = jest.fn().mockResolvedValue(undefined)
const mockShutdown = jest.fn().mockResolvedValue(undefined)
const mockPostHog = jest.fn().mockImplementation(() => ({
  capture: mockCapture,
  flush: mockFlush,
  shutdown: mockShutdown,
}))
const mockEnv: Record<string, unknown> = {}

jest.mock('posthog-node', () => ({ PostHog: mockPostHog }))
jest.mock('@/constants', () => ({ ENV: mockEnv }))

import type { AnalyticsEvent } from '@stardust/core/analytics/structures'

import { PostHogAnalyticsProvider } from '../PostHogAnalyticsProvider'

function createEvent(name: string): AnalyticsEvent {
  return {
    distinctId: { value: 'user-id' },
    name: { value: name },
    properties: {},
    insertId: { value: `${name}-insert-id` },
  } as unknown as AnalyticsEvent
}

describe('PostHog analytics provider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockEnv.mode = 'production'
    mockEnv.posthogProjectToken = 'token'
    mockEnv.posthogHost = 'https://eu.posthog.com'
  })

  it('should create the PostHog client once and flush after every event', async () => {
    const provider = new PostHogAnalyticsProvider()

    await provider.trackEvent(createEvent('first'))
    await new PostHogAnalyticsProvider().trackEvent(createEvent('second'))

    expect(mockPostHog).toHaveBeenCalledTimes(1)
    expect(mockCapture).toHaveBeenCalledTimes(2)
    expect(mockFlush).toHaveBeenCalledTimes(2)
    expect(mockShutdown).not.toHaveBeenCalled()
  })

  it('should not send events when PostHog is not configured', async () => {
    mockEnv.posthogProjectToken = undefined

    await new PostHogAnalyticsProvider().trackEvent(createEvent('ignored'))

    expect(mockCapture).not.toHaveBeenCalled()
  })
})
