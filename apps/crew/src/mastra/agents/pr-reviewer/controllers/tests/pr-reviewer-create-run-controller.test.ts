import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { PrReviewerRestFixture } from '@/mastra/agents/pr-reviewer/controllers/tests/pr-reviewer-rest-fixture'

describe('PrReviewerCreateRunController', () => {
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
    const { status, body } = await fixture.request(
      '/pr-reviewer/v1/runs',
      { method: 'POST', body: '{}' },
      { authorized: false },
    )

    expect(status).toBe(401)
    expect(body).toEqual({ error: { code: 'unauthorized' } })
  })

  it('requires the Idempotency-Key header', async () => {
    const { status, body } = await fixture.request('/pr-reviewer/v1/runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(PrReviewerRestFixture.buildInput()),
    })

    expect(status).toBe(400)
    expect(body.error.code).toBe('missing_idempotency_key')
  })

  it('rejects an invalid input and names the invalid fields', async () => {
    const { status, body } = await fixture.createRun(
      PrReviewerRestFixture.buildInput({ head_sha: 'not-a-sha', changed_files: [] }),
      'key-invalid',
    )

    expect(status).toBe(400)
    expect(body.error.code).toBe('invalid_input')
    expect(body.error.message).toContain('head_sha')
    expect(body.error.message).toContain('changed_files')
  })

  it('accepts a valid input, runs the workflow and stores the completed review', async () => {
    const { status, body } = await fixture.createRun(
      PrReviewerRestFixture.buildInput(),
      'key-1',
    )

    expect(status).toBe(202)
    expect(body.run_id).toEqual(expect.any(String))
    expect(['started', 'running', 'completed']).toContain(body.status)

    const finished = await fixture.waitForRun(body.run_id)

    expect(finished.status).toBe('completed')
    expect(finished.output).toMatchObject({
      scope: 'repository',
      head_sha: 'a'.repeat(40),
      review_status: 'complete',
      findings: [],
    })
  })

  it('returns the same run for a repeated key and input', async () => {
    const input = PrReviewerRestFixture.buildInput()

    const first = await fixture.createRun(input, 'key-replay')
    const second = await fixture.createRun(input, 'key-replay')

    expect(second.status).toBe(202)
    expect(second.body.run_id).toBe(first.body.run_id)
    await fixture.waitForRun(first.body.run_id)
  })

  it('rejects a repeated key with a different input', async () => {
    const first = await fixture.createRun(
      PrReviewerRestFixture.buildInput(),
      'key-conflict',
    )
    const second = await fixture.createRun(
      PrReviewerRestFixture.buildInput({ pull_number: 8 }),
      'key-conflict',
    )

    expect(second.status).toBe(409)
    expect(second.body.error.code).toBe('idempotency_conflict')
    await fixture.waitForRun(first.body.run_id)
  })

  it('records a failed run with the workflow error code', async () => {
    fixture.shouldFailReviews = true

    const { body } = await fixture.createRun(
      PrReviewerRestFixture.buildInput(),
      'key-failure',
    )
    const finished = await fixture.waitForRun(body.run_id)

    expect(finished.status).toBe('failed')
    expect(finished.error.code).toBe('reviewer_failed')
  })
})
