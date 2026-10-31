import { USAGE_COLLECTOR_KEY } from '@/mastra/agents/pr-reviewer/constants/usage-collector-key'
import { MODEL_PRICES } from '@/mastra/agents/pr-reviewer/constants/model-prices'
import type { ModelPrice } from '@/mastra/agents/pr-reviewer/types/model-price'
import type { ModelPrices } from '@/mastra/agents/pr-reviewer/types/model-prices'
import type { UsageCollector } from '@/mastra/agents/pr-reviewer/types/usage-collector'
import type { UsageTotals } from '@/mastra/agents/pr-reviewer/types/usage-totals'
import type { ReviewerUsage } from '@/mastra/agents/pr-reviewer/types/reviewer-usage'

const TOKENS_PER_PRICE_UNIT = 1_000_000
const SKILL_TOOL_NAME = 'skill'

type UsageLedgerHelperDependencies = {
  prices?: ModelPrices
}

export class UsageLedgerHelper {
  private readonly prices: ModelPrices
  private readonly collectorsByScenario = new Map<string, UsageCollector[]>()

  constructor({ prices = MODEL_PRICES }: UsageLedgerHelperDependencies = {}) {
    this.prices = prices
  }

  findModelPrice(modelId: string | undefined): ModelPrice | undefined {
    const priceKey = Object.keys(this.prices).find((key) => modelId?.includes(key))

    return priceKey ? this.prices[priceKey] : undefined
  }

  estimateCost(usage: ReviewerUsage): number | undefined {
    if (usage.trace?.status === 'error' && !usage.modelId) return 0

    const price = this.findModelPrice(usage.modelId)

    if (!price) return undefined

    const uncachedInputTokens = Math.max(usage.inputTokens - usage.cachedInputTokens, 0)

    return (
      (uncachedInputTokens * price.input +
        usage.cachedInputTokens * price.cachedInput +
        usage.outputTokens * price.output) /
      TOKENS_PER_PRICE_UNIT
    )
  }

  sumUsage(usages: ReviewerUsage[]): UsageTotals {
    const costs = usages.map((usage) => this.estimateCost(usage))

    return {
      inputTokens: usages.reduce((total, usage) => total + usage.inputTokens, 0),
      cachedInputTokens: usages.reduce(
        (total, usage) => total + usage.cachedInputTokens,
        0,
      ),
      outputTokens: usages.reduce((total, usage) => total + usage.outputTokens, 0),
      estimatedCost: costs.some((cost) => cost === undefined)
        ? undefined
        : costs.reduce<number>((total, cost) => total + (cost ?? 0), 0),
    }
  }

  countToolCalls(usages: ReviewerUsage[]): { total: number; failed: number } {
    const calls = usages
      .flatMap((usage) => usage.trace?.toolCalls ?? [])
      .filter((call) => call.name !== SKILL_TOOL_NAME)

    return {
      total: calls.length,
      failed: calls.filter((call) => call.outcome === 'error').length,
    }
  }

  formatTotals(totals: UsageTotals): string {
    const cost =
      totals.estimatedCost === undefined
        ? 'cost n/a (unpriced model)'
        : `~$${totals.estimatedCost.toFixed(4)}`

    return `input ${totals.inputTokens} (cached ${totals.cachedInputTokens}), output ${totals.outputTokens}, ${cost}`
  }

  readUsage(run: { requestContext?: unknown }): ReviewerUsage[] {
    const requestContext = run.requestContext as Record<string, unknown> | undefined
    const collector = (
      typeof requestContext?.get === 'function'
        ? (requestContext as unknown as { get(key: string): unknown }).get(
            USAGE_COLLECTOR_KEY,
          )
        : requestContext?.[USAGE_COLLECTOR_KEY]
    ) as UsageCollector | undefined

    return collector?.usages ?? []
  }

  createCollector(scenario: string): UsageCollector {
    const usages: ReviewerUsage[] = []
    const collector: UsageCollector = {
      usages,
      record: (usage) => {
        usages.push(usage)
      },
    }

    this.collectorsByScenario.set(scenario, [
      ...(this.collectorsByScenario.get(scenario) ?? []),
      collector,
    ])

    return collector
  }

  report(): string {
    const lines = [...this.collectorsByScenario.entries()].map(
      ([scenario, collectors]) =>
        `  ${scenario}: ${this.formatTotals(
          this.sumUsage(collectors.flatMap((c) => c.usages)),
        )}`,
    )
    const total = this.sumUsage(
      [...this.collectorsByScenario.values()]
        .flat()
        .flatMap((collector) => collector.usages),
    )

    return [
      'Token usage and estimated cost (USD, from fixed price constants, not billed amounts)',
      ...lines,
      `  total: ${this.formatTotals(total)}`,
    ].join('\n')
  }
}
