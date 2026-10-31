import type { EvalCase } from '@/mastra/agents/pr-reviewer/types/eval-case'
import type { ReviewerUsage } from '@/mastra/agents/pr-reviewer/types/reviewer-usage'

export type ItemDiagnosticsInput = {
  scenario: string
  groundTruth: { name?: string; expected: EvalCase['expected'] }
  targetResult: {
    scoringData?: { output?: unknown; stepResults?: Record<string, unknown> }
  }
  scorerResults: Record<string, { score?: unknown } | undefined>
  reviewers?: ReviewerUsage[]
}
