import { selectFeedbackClient } from '@/app/hono/routers/reporting/selectFeedbackClient'

describe('selectFeedbackClient', () => {
  it('uses the service-role client for god accounts', () => {
    const requestClient = {} as Parameters<typeof selectFeedbackClient>[1]
    const adminClient = {} as Parameters<typeof selectFeedbackClient>[2]

    expect(selectFeedbackClient(true, requestClient, adminClient)).toBe(adminClient)
  })

  it('keeps the request client for regular accounts', () => {
    const requestClient = {} as Parameters<typeof selectFeedbackClient>[1]
    const adminClient = {} as Parameters<typeof selectFeedbackClient>[2]

    expect(selectFeedbackClient(false, requestClient, adminClient)).toBe(requestClient)
  })
})
