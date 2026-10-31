import { Mastra } from '@mastra/core'
import { runEvals } from '@mastra/core/evals'
import { RequestContext } from '@mastra/core/request-context'
import { createTool } from '@mastra/core/tools'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'

import { PR_REVIEWER_COMPOSIO } from '@/mastra/agents/pr-reviewer/connections/composio'
import { COMPOSIO_TOOLSET_KEY } from '@/mastra/agents/pr-reviewer/constants/composio-toolset-key'

import { EvalDatasetsHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/eval-datasets-helper'
import type { EvalCase } from '@/mastra/agents/pr-reviewer/types/eval-case'
import { ReviewInputFaker } from '@/mastra/agents/pr-reviewer/evals/fakers/review-input-faker'
import { composioUsageScorer } from '@/mastra/agents/pr-reviewer/evals/scorers/composio-usage-scorer'
import { costScorer } from '@/mastra/agents/pr-reviewer/evals/scorers/cost-scorer'
import { falsePositivesScorer } from '@/mastra/agents/pr-reviewer/evals/scorers/false-positives-scorer'
import { qualityScorer } from '@/mastra/agents/pr-reviewer/evals/scorers/quality-scorer'
import { recallScorer } from '@/mastra/agents/pr-reviewer/evals/scorers/recall-scorer'
import { REVIEW_RECALL_THRESHOLD } from '@/mastra/agents/pr-reviewer/constants/review-recall-threshold'
import { ReviewDiagnosticsHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/review-diagnostics-helper'
import type { ItemDiagnosticsInput } from '@/mastra/agents/pr-reviewer/types/item-diagnostics-input'
import { UsageLedgerHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/usage-ledger-helper'
import { usageScorer } from '@/mastra/agents/pr-reviewer/evals/scorers/usage-scorer'
import { validLocationsScorer } from '@/mastra/agents/pr-reviewer/evals/scorers/valid-locations-scorer'
import { USAGE_COLLECTOR_KEY } from '@/mastra/agents/pr-reviewer/constants/usage-collector-key'
import type { UsageCollector } from '@/mastra/agents/pr-reviewer/types/usage-collector'
import { validOutputScorer } from '@/mastra/agents/pr-reviewer/evals/scorers/valid-output-scorer'
import { REVIEWER_USAGE_RECORDER_KEY } from '@/mastra/agents/pr-reviewer/constants/reviewer-usage-recorder-key'
import { PrReviewWorkflow } from '@/mastra/workflows/pr-review-workflow'
import { PrReviewerFixture } from '@/mastra/agents/pr-reviewer/tests/pr-reviewer-fixture'

const prReviewerFixture = new PrReviewerFixture()

const NO_REVIEW_COMMENTS_TOOL = createTool({
  id: 'GITHUB_LIST_REVIEW_COMMENTS_ON_A_PULL_REQUEST',
  description: 'Lists the review comments on a pull request.',
  inputSchema: z.object({
    owner: z.string(),
    repo: z.string(),
    pull_number: z.number(),
  }),
  execute: async () => ({ data: { comments: [] }, error: null, successful: true }),
})

describe('PR Reviewer Agent', () => {
  const evalDatasetsHelper = new EvalDatasetsHelper()
  const datasets = evalDatasetsHelper.load()
  const mastra = new Mastra({
    agents: { 'pr-reviewer': prReviewerFixture.loadPrReviewerAgent() },
    workflows: { 'pr-review': new PrReviewWorkflow().create() },
    logger: false,
  })
  const workflow = mastra.getWorkflow('pr-review')
  const ledger = new UsageLedgerHelper()
  const diagnostics = new ReviewDiagnosticsHelper()

  beforeAll(() => {
    evalDatasetsHelper.assertPrerequisites(datasets)
  })

  afterAll(() => {
    console.log(ledger.report())
  })

  const reviewInputFaker = new ReviewInputFaker()
  let toolsetPromise: ReturnType<typeof PR_REVIEWER_COMPOSIO.createToolset> | undefined

  async function createToolset() {
    toolsetPromise ??= PR_REVIEWER_COMPOSIO.createToolset()

    return {
      ...(await toolsetPromise),
      GITHUB_LIST_REVIEW_COMMENTS_ON_A_PULL_REQUEST: NO_REVIEW_COMMENTS_TOOL,
    }
  }

  function buildItem(
    scenario: string,
    evalCase: EvalCase,
    toolset: Awaited<ReturnType<typeof createToolset>>,
  ) {
    const input = reviewInputFaker.fake(evalCase)
    const collector = ledger.createCollector(scenario)
    const requestContext = new RequestContext()

    requestContext.set(COMPOSIO_TOOLSET_KEY, toolset)
    requestContext.set(REVIEWER_USAGE_RECORDER_KEY, collector.record)
    requestContext.set(USAGE_COLLECTOR_KEY, collector)

    return {
      input,
      groundTruth: { name: evalCase.name, expected: evalCase.expected },
      requestContext,
    }
  }

  async function evaluateScenario(scenario: string, names: string[]) {
    const toolset = await createToolset()
    const items = names.map((name) => {
      const evalCase = datasets.find((dataset) => dataset.name === name)
      if (!evalCase) throw new Error(`Dataset ${name} not found`)

      return buildItem(scenario, evalCase, toolset)
    })

    const result = await runEvals({
      target: workflow,
      data: items,
      scorers: [
        recallScorer,
        falsePositivesScorer,
        validLocationsScorer,
        qualityScorer,
        validOutputScorer,
        usageScorer,
        costScorer,
        composioUsageScorer,
      ],
      concurrency: 1,
      onItemComplete: ({ item, targetResult, scorerResults }) => {
        const collector = item.requestContext?.get(USAGE_COLLECTOR_KEY) as
          | UsageCollector
          | undefined

        console.log(
          diagnostics.formatItem({
            scenario,
            groundTruth: item.groundTruth,
            targetResult: targetResult as ItemDiagnosticsInput['targetResult'],
            scorerResults,
            reviewers: collector?.usages,
          }),
        )
      },
    })

    expect(result.summary.totalItems).toBe(items.length)
    expect(result.scores['valid-review-output']).toBe(1)
    expect(result.scores['valid-path-and-line']).toBe(1)
    expect(result.scores['found-expected-recall']).toBeGreaterThanOrEqual(
      REVIEW_RECALL_THRESHOLD,
    )
  }

  for (const dataset of datasets) {
    it(dataset.description, () => evaluateScenario(dataset.name, [dataset.name]))
  }
})
