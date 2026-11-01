import { describe, expect, it } from 'vitest'

import { ReviewScoringHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/review-scoring-helper'
import type { EvalCase } from '@/mastra/agents/pr-reviewer/types/eval-case'
import type { ReviewOutput } from '@/mastra/agents/pr-reviewer/types/review-output'

type Finding = ReviewOutput['findings'][number]

const PATH = 'scripts/a.mjs'
const helper = new ReviewScoringHelper()

function fakeFinding(overrides: Partial<Finding> = {}): Finding {
  return {
    path: PATH,
    line: 24,
    severity: 'P2',
    area: 'security',
    title: 'Título',
    body: 'Corpo',
    ...overrides,
  }
}

function fakeOutput(findings: Finding[]): ReviewOutput {
  return {
    scope: 'repository',
    head_sha: 'a'.repeat(40),
    review_status: 'complete',
    summary: 'Resumo',
    findings,
  }
}

const expected: EvalCase['expected'] = [
  { path: PATH, lines: [24, 24], area: 'security' },
  { path: PATH, lines: [18, 21], area: 'performance' },
]

describe('ReviewScoringHelper line matching', () => {
  it('accepts a finding on the expected path and area inside the line range', () => {
    expect(helper.isExpectedFinding(fakeFinding({ line: 24 }), expected[0])).toBe(true)
    expect(
      helper.isExpectedFinding(
        fakeFinding({ line: 20, area: 'performance' }),
        expected[1],
      ),
    ).toBe(true)
  })

  it('rejects a finding anchored outside the line range', () => {
    expect(helper.isExpectedFinding(fakeFinding({ line: 22 }), expected[0])).toBe(false)
  })

  it('still rejects a different path or area on the right line', () => {
    expect(
      helper.isExpectedFinding(fakeFinding({ path: 'other.mjs' }), expected[0]),
    ).toBe(false)
    expect(
      helper.isExpectedFinding(fakeFinding({ area: 'regression' }), expected[0]),
    ).toBe(false)
  })

  it('lowers recall when the only matching finding is misanchored', () => {
    const output = fakeOutput([fakeFinding({ line: 22 })])

    expect(helper.calculateRecall(output, expected)).toBe(0)
    expect(
      helper.calculateRecall(fakeOutput([fakeFinding({ line: 24 })]), expected),
    ).toBe(0.5)
  })

  it('counts a misanchored finding as a false positive', () => {
    const output = fakeOutput([fakeFinding({ line: 24 }), fakeFinding({ line: 22 })])

    expect(helper.calculateFalsePositives(output, expected)).toBe(0.5)
  })

  it('keeps empty-expectation behavior unchanged', () => {
    expect(helper.calculateRecall(fakeOutput([fakeFinding()]), [])).toBe(1)
    expect(helper.calculateFalsePositives(fakeOutput([]), [])).toBe(1)
    expect(helper.calculateFalsePositives(fakeOutput([fakeFinding()]), [])).toBe(0)
  })
})
