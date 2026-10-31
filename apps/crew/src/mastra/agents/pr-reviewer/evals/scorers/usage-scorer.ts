import { createScorer } from '@mastra/core/evals'

import { UsageLedgerHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/usage-ledger-helper'

const usageLedgerHelper = new UsageLedgerHelper()

export const usageScorer = createScorer({
  id: 'review-usage',
  description: 'Reports input, cached and output tokens of one review.',
})
  .preprocess(({ run }) => {
    const usages = usageLedgerHelper.readUsage(run)

    return { callsCount: usages.length, totals: usageLedgerHelper.sumUsage(usages) }
  })
  .generateScore(({ results }) => (results.preprocessStepResult.callsCount > 0 ? 1 : 0))
  .generateReason(({ results }) => {
    const { callsCount, totals } = results.preprocessStepResult

    return callsCount === 0
      ? 'No usage recorded.'
      : `${callsCount} model calls: ${usageLedgerHelper.formatTotals(totals)}`
  })
