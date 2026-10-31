import type { EvalCase } from '@/mastra/agents/pr-reviewer/types/eval-case'

export type ReviewEvalGroundTruth = {
  name?: string
  expected: EvalCase['expected']
}
