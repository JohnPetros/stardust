import { createScorer } from '@mastra/core/evals'

import { UsageLedgerHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/usage-ledger-helper'
import { REVIEW_COST_BUDGET_USD } from '@/mastra/agents/pr-reviewer/constants/review-cost-budget-usd'

const usageLedgerHelper = new UsageLedgerHelper()

function calculateCostScore(estimatedCost: number | undefined): number {
  if (estimatedCost === undefined) return 0

  return estimatedCost <= REVIEW_COST_BUDGET_USD
    ? 1
    : REVIEW_COST_BUDGET_USD / estimatedCost
}

export const costScorer = createScorer({
  id: 'review-cost',
  description: 'Estimated cost of one review against a per-review budget.',
})
  .preprocess(({ run }) => {
    const usages = usageLedgerHelper.readUsage(run)

    return {
      callsCount: usages.length,
      estimatedCost: usageLedgerHelper.sumUsage(usages).estimatedCost,
    }
  })
  .generateScore(({ results }) => {
    const { callsCount, estimatedCost } = results.preprocessStepResult

    return callsCount === 0 ? 0 : calculateCostScore(estimatedCost)
  })
  .generateReason(({ results }) => {
    const { estimatedCost } = results.preprocessStepResult

    return estimatedCost === undefined
      ? 'Cost unknown: no usage or an unpriced model.'
      : `Estimated cost ~$${estimatedCost.toFixed(4)} against a budget of $${REVIEW_COST_BUDGET_USD}.`
  })
