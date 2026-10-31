import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { PrReviewerRestFixture } from '@/mastra/agents/pr-reviewer/controllers/tests/pr-reviewer-rest-fixture'

const LAST_REVIEW_URL =
  '/pr-reviewer/v1/last-review?repository=JohnPetros/stardust&pull_number=7'

describe('PrReviewerLastReviewController', () => {
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
    const { status } = await fixture.request(LAST_REVIEW_URL, {}, { authorized: false })

    expect(status).toBe(401)
  })

  it('rejects an invalid query and names the invalid fields', async () => {
    const { status, body } = await fixture.request(
      '/pr-reviewer/v1/last-review?repository=nope&pull_number=0',
    )

    expect(status).toBe(400)
    expect(body.error.code).toBe('invalid_input')
    expect(body.error.message).toContain('repository')
    expect(body.error.message).toContain('pull_number')
  })

  it('answers not found when the pull request has no completed review', async () => {
    const { status, body } = await fixture.request(LAST_REVIEW_URL)

    expect(status).toBe(404)
    expect(body.error.code).toBe('review_not_found')
  })

  it('returns the head commit of the last completed review', async () => {
    const accepted = await fixture.createRun(
      PrReviewerRestFixture.buildInput({ head_sha: 'c'.repeat(40) }),
      'key-last-review',
    )

    await fixture.waitForRun(accepted.body.run_id)

    const { status, body } = await fixture.request(LAST_REVIEW_URL)

    expect(status).toBe(200)
    expect(body.head_sha).toBe('c'.repeat(40))
    expect(body.run_id).toBe(accepted.body.run_id)
    expect(Number.isNaN(Date.parse(body.finished_at))).toBe(false)
  })

  it('finds the review regardless of the repository name casing', async () => {
    const accepted = await fixture.createRun(
      PrReviewerRestFixture.buildInput({
        repository: 'JOHNPETROS/STARDUST',
        head_sha: 'c'.repeat(40),
      }),
      'key-mixed-case',
    )

    await fixture.waitForRun(accepted.body.run_id)

    const lowerCase = await fixture.request(LAST_REVIEW_URL)
    const mixedCase = await fixture.request(
      '/pr-reviewer/v1/last-review?repository=JOHNPETROS/STARDUST&pull_number=7',
    )

    expect(lowerCase.status).toBe(200)
    expect(lowerCase.body.run_id).toBe(accepted.body.run_id)
    expect(lowerCase.body.head_sha).toBe('c'.repeat(40))
    expect(mixedCase.status).toBe(200)
    expect(mixedCase.body.run_id).toBe(accepted.body.run_id)
  })

  it('ignores a failed run and keeps the previous completed review', async () => {
    const completed = await fixture.createRun(
      PrReviewerRestFixture.buildInput({ head_sha: 'c'.repeat(40) }),
      'key-first',
    )

    await fixture.waitForRun(completed.body.run_id)
    fixture.shouldFailReviews = true

    const failed = await fixture.createRun(
      PrReviewerRestFixture.buildInput({ head_sha: 'd'.repeat(40) }),
      'key-second',
    )

    await fixture.waitForRun(failed.body.run_id)

    const { body } = await fixture.request(LAST_REVIEW_URL)

    expect(body.head_sha).toBe('c'.repeat(40))
    expect(body.run_id).toBe(completed.body.run_id)
  })
})
