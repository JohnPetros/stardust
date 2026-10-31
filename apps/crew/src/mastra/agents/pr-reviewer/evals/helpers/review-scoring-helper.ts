import { reviewOutputSchema } from '@/mastra/agents/pr-reviewer/schemas/review-output-schema'
import type { EvalCase } from '@/mastra/agents/pr-reviewer/types/eval-case'
import type { ReviewInput } from '@/mastra/agents/pr-reviewer/types/review-input'
import type { ReviewOutput } from '@/mastra/agents/pr-reviewer/types/review-output'

type ChangedLocations = Pick<ReviewInput, 'changed_files' | 'changed_lines'>

export class ReviewScoringHelper {
  isValidOutput(output: unknown): output is ReviewOutput {
    return reviewOutputSchema.safeParse(output).success
  }

  readOutput(output: unknown): ReviewOutput | undefined {
    return this.isValidOutput(output) ? output : undefined
  }

  isExpectedFinding(
    finding: ReviewOutput['findings'][number],
    expected: EvalCase['expected'][number],
  ): boolean {
    return finding.path === expected.path && finding.area === expected.area
  }

  calculateRecall(
    output: ReviewOutput | undefined,
    expected: EvalCase['expected'],
  ): number {
    if (!output) return 0
    if (expected.length === 0) return 1

    const found = expected.filter((item) =>
      output.findings.some((finding) => this.isExpectedFinding(finding, item)),
    )

    return found.length / expected.length
  }

  calculateFalsePositives(
    output: ReviewOutput | undefined,
    expected: EvalCase['expected'],
  ): number {
    if (!output) return 0
    if (output.findings.length === 0) return 1

    const expectedFindings = output.findings.filter((finding) =>
      expected.some((item) => this.isExpectedFinding(finding, item)),
    )

    return expectedFindings.length / output.findings.length
  }

  calculateValidLocations(
    output: ReviewOutput | undefined,
    input: ChangedLocations,
  ): number {
    if (!output) return 0
    if (output.findings.length === 0) return 1

    const changedLines = new Set(
      input.changed_lines.map(({ path, line }) => `${path}:${line}`),
    )
    const valid = output.findings.filter(
      (finding) =>
        input.changed_files.includes(finding.path) &&
        changedLines.has(`${finding.path}:${finding.line}`),
    )

    return valid.length / output.findings.length
  }
}
