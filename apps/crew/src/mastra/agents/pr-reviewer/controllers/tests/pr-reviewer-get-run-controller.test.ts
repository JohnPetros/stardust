import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { PrReviewerRestFixture } from '@/mastra/agents/pr-reviewer/controllers/tests/pr-reviewer-rest-fixture'

const UNKNOWN_RUN_ID = '00000000-0000-4000-8000-000000000000'

describe('PrReviewerGetRunController', () => {
  let fixture: PrReviewerRestFixture

  beforeAll(async () => {
    fixture = await PrReviewerRestFixture.start()
  })

  beforeEach(async () => {
    await fixture.reset()
  })

  afterAll(async () => {
    await fixture.close()
  })

  it('rejects a request without the agent API key', async () => {
    const { status } = await fixture.request(
      `/pr-reviewer/v1/runs/${UNKNOWN_RUN_ID}`,
      {},
      { authorized: false },
    )

    expect(status).toBe(401)
  })

  it('answers not found for an id that is not a UUID', async () => {
    const { status, body } = await fixture.request('/pr-reviewer/v1/runs/not-a-uuid')

    expect(status).toBe(404)
    expect(body.error.code).toBe('run_not_found')
  })

  it('answers not found for an unknown run', async () => {
    const { status, body } = await fixture.request(
      `/pr-reviewer/v1/runs/${UNKNOWN_RUN_ID}`,
    )

    expect(status).toBe(404)
    expect(body.error.code).toBe('run_not_found')
  })

  it('returns the output of a completed run', async () => {
    const accepted = await fixture.createRun(
      PrReviewerRestFixture.buildInput(),
      'key-completed',
    )

    await fixture.waitForRun(accepted.body.run_id)

    const { status, body } = await fixture.request(
      `/pr-reviewer/v1/runs/${accepted.body.run_id}`,
    )

    expect(status).toBe(200)
    expect(body.run_id).toBe(accepted.body.run_id)
    expect(body.status).toBe('completed')
    expect(body.output.review_status).toBe('complete')
    expect(body.error).toBeUndefined()
  })

  it('returns the error code of a failed run and no output', async () => {
    fixture.shouldFailReviews = true

    const accepted = await fixture.createRun(
      PrReviewerRestFixture.buildInput(),
      'key-failed',
    )

    await fixture.waitForRun(accepted.body.run_id)

    const { body } = await fixture.request(`/pr-reviewer/v1/runs/${accepted.body.run_id}`)

    expect(body.status).toBe('failed')
    expect(body.error.code).toBe('reviewer_failed')
    expect(body.output).toBeUndefined()
  })
})
