import { createScorer } from '@mastra/core/evals'

import { UsageLedgerHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/usage-ledger-helper'

const usageLedgerHelper = new UsageLedgerHelper()

export const composioUsageScorer = createScorer({
  id: 'composio-usage',
  description:
    'Reports how many Composio tool calls one review made and how many failed.',
})
  .preprocess(({ run }) =>
    usageLedgerHelper.countToolCalls(usageLedgerHelper.readUsage(run)),
  )
  .generateScore(({ results }) => {
    const { total, failed } = results.preprocessStepResult

    return total === 0 ? 0 : (total - failed) / total
  })
  .generateReason(({ results }) => {
    const { total, failed } = results.preprocessStepResult

    return total === 0
      ? 'No Composio tool calls recorded.'
      : `${total} Composio tool calls, ${failed} failed.`
  })
