import type { ReviewerUsage } from '@/mastra/agents/pr-reviewer/types/reviewer-usage'
import { describeError } from '@/utils/describe-error'
import type { ItemDiagnosticsInput } from '@/mastra/agents/pr-reviewer/types/item-diagnostics-input'
import { UsageLedgerHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/usage-ledger-helper'
import { ReviewScoringHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/review-scoring-helper'

const MAX_TITLE_LENGTH = 100
const MAX_SUMMARY_LENGTH = 300
const MAX_BLOCKED_REASON_LENGTH = 160
const MAX_TOOL_ERROR_LENGTH = 80
const MAX_ANSWER_LENGTH = 240

const SCORER_LABELS: Array<[scorerId: string, label: string]> = [
  ['found-expected-recall', 'recall'],
  ['false-positive-penalty', 'false-positives'],
  ['valid-path-and-line', 'valid-locations'],
  ['review-quality', 'quality'],
  ['valid-review-output', 'valid-output'],
  ['review-usage', 'usage'],
  ['review-cost', 'cost'],
  ['composio-usage', 'composio'],
]

export class ReviewDiagnosticsHelper {
  private readonly reviewScoringHelper = new ReviewScoringHelper()
  private readonly usageLedgerHelper = new UsageLedgerHelper()

  formatItem({
    scenario,
    groundTruth,
    targetResult,
    scorerResults,
    reviewers = [],
  }: ItemDiagnosticsInput): string {
    const output = targetResult.scoringData?.output
    const lines = [
      `[eval] scenario=${scenario} dataset=${groundTruth.name ?? 'unknown'}`,
      `  expected: ${
        groundTruth.expected.length === 0
          ? 'none'
          : groundTruth.expected
              .map(
                ({ path, lines: [from, to], area }) =>
                  `${path} ${area} (previous reviewer lines ${from}-${to}, not matched)`,
              )
              .join('; ')
      }`,
    ]

    if (this.reviewScoringHelper.isValidOutput(output)) {
      lines.push(
        `  output: review_status=${output.review_status} summary=${this.truncate(output.summary, MAX_SUMMARY_LENGTH)}`,
        `  findings (${output.findings.length}):`,
        ...output.findings.map(
          (finding) =>
            `    ${finding.path}:${finding.line} ${finding.severity} ${finding.area} ${this.truncate(finding.title, MAX_TITLE_LENGTH)}${
              groundTruth.expected.some((item) =>
                this.reviewScoringHelper.isExpectedFinding(finding, item),
              )
                ? ' [expected]'
                : ''
            }`,
        ),
      )
    } else {
      lines.push(
        output === undefined
          ? '  output: none (the workflow did not succeed)'
          : '  output: present but invalid for the output schema',
      )
    }

    lines.push(...this.describeFailedSteps(targetResult.scoringData?.stepResults))
    lines.push(...reviewers.flatMap((reviewer) => this.describeReviewer(reviewer)))
    lines.push(
      `  scores: ${SCORER_LABELS.map(([id, label]) => `${label}=${this.formatScore(scorerResults[id])}`).join(' ')}`,
    )

    return lines.join('\n')
  }

  private truncate(text: string, maxLength: number): string {
    const singleLine = text.replace(/\s+/g, ' ').trim()

    return singleLine.length > maxLength
      ? `${singleLine.slice(0, maxLength)}...`
      : singleLine
  }

  private formatSeconds(elapsedMs: number): string {
    return `${(elapsedMs / 1000).toFixed(1)}s`
  }

  private formatScore(result: { score?: unknown } | undefined): string {
    return typeof result?.score === 'number' ? result.score.toFixed(2) : 'n/a'
  }

  private describeFailedSteps(
    stepResults: Record<string, unknown> | undefined,
  ): string[] {
    return Object.entries(stepResults ?? {}).flatMap(([stepId, result]) => {
      const step = result as { status?: unknown; error?: unknown } | undefined

      return step?.status === 'failed'
        ? [`  failed step ${stepId}: ${describeError(step.error)}`]
        : []
    })
  }

  private describeReviewer(reviewer: ReviewerUsage): string[] {
    const { trace } = reviewer

    const isFailed = trace?.status === 'invalid' || trace?.status === 'error'
    const answer = trace
      ? [
          ...(trace.answer !== undefined || isFailed
            ? [
                `    answer=${trace.answer === undefined ? '(none)' : this.truncate(trace.answer, MAX_ANSWER_LENGTH)}`,
              ]
            : []),
          ...(isFailed
            ? [
                `    structuring status=${trace.structuringStatus ?? 'n/a'} parse_failures=${trace.parseFailures?.join(',') || 'none'}`,
              ]
            : []),
        ]
      : []

    if (trace?.status === 'error' && reviewer.inputTokens === 0) {
      return [
        `  reviewer ${reviewer.area}: status=error code=${trace.failure ?? 'reviewer_failed'} elapsed=${this.formatSeconds(trace.elapsedMs)} (the reviewer threw; no usage)`,
        ...answer,
      ]
    }

    const usage = this.usageLedgerHelper.formatTotals(
      this.usageLedgerHelper.sumUsage([reviewer]),
    )

    if (!trace) return [`  reviewer ${reviewer.area}: no trace; ${usage}`]

    const header = `  reviewer ${reviewer.area}: status=${trace.status}${trace.failure ? ` code=${trace.failure}` : ''} steps=${trace.stepsCount} finish=${trace.finishReason ?? 'n/a'} elapsed=${this.formatSeconds(trace.elapsedMs)}; ${usage}`
    const blocked = trace.blockedReason
      ? [
          `    blocked_reason: ${this.truncate(trace.blockedReason, MAX_BLOCKED_REASON_LENGTH)}`,
        ]
      : []
    const toolCalls = trace.toolCalls.map((call) => {
      const target = call.target ? ` ${this.truncate(call.target, MAX_TITLE_LENGTH)}` : ''
      const outcome =
        call.outcome === 'ok'
          ? 'ok'
          : `error: ${this.truncate(call.error ?? 'unknown', MAX_TOOL_ERROR_LENGTH)}`

      return `    tool ${call.name}${target} ${outcome}`
    })

    return [header, ...answer, ...blocked, ...toolCalls]
  }
}
